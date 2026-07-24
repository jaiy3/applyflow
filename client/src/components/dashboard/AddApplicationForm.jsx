import { useEffect, useState } from "react";
import {
  createApplication,
  updateApplication,
} from "../../services/applicationService";

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
});

    useEffect(() => {
  if (editingApplication) {
    setFormData({
      company: editingApplication.company,
      jobTitle: editingApplication.jobTitle,
      status: editingApplication.status,
      dateApplied: editingApplication.dateApplied || "",
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
});

if (editingApplication && onEditComplete) {
  onEditComplete();
}

alert(
  editingApplication
    ? "Application updated!"
    : "Application created!"
);

if (onClose) {
  onClose();
}
    } catch (error) {
        console.error(error);

        const response = error.response?.data;

        if (response?.errors) {
          const messages = response.errors
            .map((err) => err.message)
            .join("\n");

          alert(messages);
        } else {
          alert(response?.message || "Something went wrong.");
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