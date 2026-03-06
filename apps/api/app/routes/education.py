import secrets
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from marshmallow import Schema, fields, validate, ValidationError
from app.extensions import db
from app.models.education import Institution, Class, ClassStudent, Assignment, AssignmentSubmission, InstitutionMember

education_bp = Blueprint("education", __name__)


class CreateInstitutionSchema(Schema):
    name = fields.Str(required=True, validate=validate.Length(min=1, max=255))
    type = fields.Str(load_default="school", validate=validate.OneOf(["school", "college", "ngo"]))


class CreateClassSchema(Schema):
    institutionId = fields.Str(required=True)
    name = fields.Str(required=True, validate=validate.Length(min=1, max=255))
    description = fields.Str(allow_none=True)


class JoinClassSchema(Schema):
    joinCode = fields.Str(required=True, validate=validate.Length(min=1))


create_institution_schema = CreateInstitutionSchema()
create_class_schema = CreateClassSchema()
join_class_schema = JoinClassSchema()


@education_bp.route("/institutions", methods=["GET"])
@jwt_required()
def list_institutions():
    user_id = get_jwt_identity()
    memberships = InstitutionMember.query.filter_by(user_id=user_id).all()
    institutions = [
        {
            "id": str(m.institution.id),
            "name": m.institution.name,
            "type": m.institution.type,
            "role": m.role,
        }
        for m in memberships
    ]
    return jsonify(institutions)


@education_bp.route("/institutions", methods=["POST"])
@jwt_required()
def create_institution():
    user_id = get_jwt_identity()
    try:
        data = create_institution_schema.load(request.get_json() or {})
    except ValidationError as e:
        return jsonify({"error": "Validation failed", "details": e.messages}), 400

    slug = data["name"].lower().replace(" ", "-")
    if Institution.query.filter_by(slug=slug).first():
        return jsonify({"error": "Institution with this name already exists"}), 409

    institution = Institution(
        name=data["name"], slug=slug, type=data["type"], created_by=user_id,
    )
    db.session.add(institution)
    db.session.flush()
    db.session.add(InstitutionMember(institution_id=institution.id, user_id=user_id, role="admin"))
    db.session.commit()
    return jsonify({"id": str(institution.id), "name": institution.name}), 201


@education_bp.route("/classes", methods=["GET"])
@jwt_required()
def list_classes():
    user_id = get_jwt_identity()
    taught = Class.query.filter_by(teacher_id=user_id, is_active=True).all()
    enrolled = (
        db.session.query(Class)
        .join(ClassStudent, Class.id == ClassStudent.class_id)
        .filter(ClassStudent.student_id == user_id, Class.is_active == True)
        .all()
    )
    return jsonify({
        "teaching": [{"id": str(c.id), "name": c.name, "joinCode": c.join_code} for c in taught],
        "enrolled": [{"id": str(c.id), "name": c.name} for c in enrolled],
    })


@education_bp.route("/classes", methods=["POST"])
@jwt_required()
def create_class():
    user_id = get_jwt_identity()
    try:
        data = create_class_schema.load(request.get_json() or {})
    except ValidationError as e:
        return jsonify({"error": "Validation failed", "details": e.messages}), 400

    institution = db.session.get(Institution, data["institutionId"])
    if not institution:
        return jsonify({"error": "Institution not found"}), 404

    cls = Class(
        institution_id=institution.id,
        name=data["name"],
        description=data.get("description"),
        teacher_id=user_id,
        join_code=secrets.token_urlsafe(6).upper(),
    )
    db.session.add(cls)
    db.session.commit()
    return jsonify({"id": str(cls.id), "name": cls.name, "joinCode": cls.join_code}), 201


@education_bp.route("/classes/join", methods=["POST"])
@jwt_required()
def join_class():
    user_id = get_jwt_identity()
    try:
        data = join_class_schema.load(request.get_json() or {})
    except ValidationError as e:
        return jsonify({"error": "Validation failed", "details": e.messages}), 400

    code = data["joinCode"].strip()
    cls = Class.query.filter_by(join_code=code, is_active=True).first()
    if not cls:
        return jsonify({"error": "Invalid join code"}), 404

    existing = ClassStudent.query.filter_by(class_id=cls.id, student_id=user_id).first()
    if existing:
        return jsonify({"error": "Already enrolled"}), 409

    db.session.add(ClassStudent(class_id=cls.id, student_id=user_id))
    db.session.commit()
    return jsonify({"message": "Joined class", "className": cls.name})


@education_bp.route("/classes/<class_id>/assignments", methods=["GET"])
@jwt_required()
def list_assignments(class_id):
    assignments = Assignment.query.filter_by(class_id=class_id).order_by(Assignment.created_at.desc()).all()
    return jsonify([
        {
            "id": str(a.id),
            "title": a.title,
            "type": a.type,
            "dueDate": a.due_date.isoformat() if a.due_date else None,
        }
        for a in assignments
    ])
