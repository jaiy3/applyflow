import { useEffect, useState } from "react";
import {
  createApplication,
  updateApplication,
} from "../../services/applicationService";
import toast from "react-hot-toast";

export default function AddApplicationForm({
  onApplicationCreated,
  onClose,
  editingApplication,
  onEditComplete,
}) {

  const [formData, setFormData] = useState({
    company: "",
    jobTitle: "",
    status: "SAVED",
    dateApplied: "",
    deadline: "",
    jobUrl: "",
    notes: "",
});

    useEffect(() => {
  if (editingApplication) {
    setFormData({
      company: editingApplication.company || "",
      jobTitle: editingApplication.jobTitle || "",
      status: editingApplication.status || "SAVED",
      dateApplied: editingApplication.dateApplied
        ? editingApplication.dateApplied.slice(0, 10)
        : "",
      deadline: editingApplication.deadline
        ? editingApplication.deadline.slice(0, 10)
        : "",
      jobUrl: editingApplication.jobUrl || "",
      notes: editingApplication.notes || "",
    });
  }
}, [editingApplication]);

    const handleChange = (event) => {
      setFormData({
          ...formData,
          [event.target.name]: event.target.value,
          });
    };

    const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (editingApplication) {
  await updateApplication(editingApplication.id, formData);
} else {
  await createApplication(formData);
}
      
      if (onApplicationCreated) {
        await onApplicationCreated();
      }

  setFormData({
    company: "",
    jobTitle: "",
    status: "SAVED",
    dateApplied: "",
    deadline: "",
    jobUrl: "",
    notes: "",
  });

if (editingApplication && onEditComplete) {
  onEditComplete();
}

toast.success(
  editingApplication
    ? "Application updated successfully!"
    : "Application created successfully!"
);

if (onClose) {
  onClose();
}
    } catch (error) {
        console.error(error);

        const response = error.response?.data;

       if (response?.errors) {
          response.errors.forEach((err) => {
            toast.error(err.message);
          });
        } else {
          toast.error(response?.message || "Something went wrong.");
        }
      }
};

  return (
    <div className="application-form">
      <h2>Add Application</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="company">Company</label>

          <input
            id="company"
            name="company"
            type="text"
            placeholder="Google"
            value={formData.company}
            onChange={handleChange}
        />
        </div>

        <div className="form-group">
         <label htmlFor="jobTitle">Job Title</label>

          <input
            id="jobTitle"
            name="jobTitle"
            type="text"
            placeholder="Backend Engineer"
            value={formData.jobTitle}
            onChange={handleChange}
         />
        </div>

        <div className="form-group">
          <label htmlFor="status">Status</label>

          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            >
            <option value="SAVED">Saved</option>
            <option value="APPLIED">Applied</option>
            <option value="INTERVIEW">Interview</option>
            <option value="OFFER">Offer</option>
            <option value="REJECTED">Rejected</option>
            <option value="WITHDRAWN">Withdrawn</option>
         </select>
        </div>

        <div className="form-group">
  <label htmlFor="dateApplied">Date Applied</label>

  <input
    id="dateApplied"
    name="dateApplied"
    type="date"
    value={formData.dateApplied}
    onChange={handleChange}
  />

  <div className="form-group">
  <label htmlFor="deadline">Application Deadline</label>

  <input
    id="deadline"
    name="deadline"
    type="date"
    value={formData.deadline}
    onChange={handleChange}
  />
</div>

<div className="form-group">
  <label htmlFor="jobUrl">Job URL</label>

  <input
    id="jobUrl"
    name="jobUrl"
    type="url"
    placeholder="https://company.com/jobs/123"
    value={formData.jobUrl}
    onChange={handleChange}
  />
</div>

<div className="form-group">
  <label htmlFor="notes">Notes</label>

  <textarea
    id="notes"
    name="notes"
    rows="4"
    placeholder="Interview notes, recruiter details, follow-up reminders..."
    value={formData.notes}
    onChange={handleChange}
  />
</div>

</div>

        <div className="form-buttons">
          {onClose && (
            <button type="button" onClick={onClose}>
              Cancel
            </button>
        )}

          <button type="submit">
            {editingApplication ? "Update Application" : "Save Application"}
          </button>
        </div>
      </form>
    </div>
  );
}