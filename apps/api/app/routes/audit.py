import uuid as _uuid
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from marshmallow import Schema, fields, validate, ValidationError
from app.extensions import db
from app.models.audit import AuditJob, AuditIssue

audit_bp = Blueprint("audit", __name__)


class CreateAuditSchema(Schema):
    url = fields.Url(required=True, schemes={"http", "https"})
    config = fields.Dict(load_default={})


create_audit_schema = CreateAuditSchema()


@audit_bp.route("/jobs", methods=["POST"])
@jwt_required()
def create_audit_job():
    user_id = get_jwt_identity()
    try:
        data = create_audit_schema.load(request.get_json() or {})
    except ValidationError as e:
        return jsonify({"error": "Validation failed", "details": e.messages}), 400

    job = AuditJob(user_id=user_id, url=data["url"], config=data.get("config", {}))
    db.session.add(job)
    db.session.commit()
    return jsonify({"id": str(job.id), "status": job.status}), 201


@audit_bp.route("/jobs", methods=["GET"])
@jwt_required()
def list_audit_jobs():
    user_id = get_jwt_identity()
    page = request.args.get("page", 1, type=int)
    per_page = min(request.args.get("perPage", 10, type=int), 50)

    pagination = (
        AuditJob.query
        .filter_by(user_id=user_id)
        .order_by(AuditJob.created_at.desc())
        .paginate(page=page, per_page=per_page, error_out=False)
    )
    return jsonify({
        "data": [
            {
                "id": str(j.id),
                "url": j.url,
                "status": j.status,
                "score": float(j.score) if j.score else None,
                "pagesScanned": j.pages_scanned,
                "createdAt": j.created_at.isoformat(),
            }
            for j in pagination.items
        ],
        "total": pagination.total,
        "page": pagination.page,
        "pages": pagination.pages,
    })


@audit_bp.route("/jobs/<job_id>", methods=["GET"])
@jwt_required()
def get_audit_job(job_id):
    user_id = get_jwt_identity()
    job = AuditJob.query.filter_by(id=job_id, user_id=user_id).first()
    if not job:
        return jsonify({"error": "Job not found"}), 404

    issues = [
        {
            "id": str(i.id),
            "severity": i.severity,
            "category": i.category,
            "wcagCriterion": i.wcag_criterion,
            "description": i.description,
            "recommendation": i.recommendation,
            "pageUrl": i.page_url,
        }
        for i in job.issues
    ]
    return jsonify({
        "id": str(job.id),
        "url": job.url,
        "status": job.status,
        "score": float(job.score) if job.score else None,
        "summary": job.summary,
        "report": job.report,
        "issues": issues,
    })
