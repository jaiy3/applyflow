import api from "../api/axios";

export async function getApplications(params = {}) {
  const { data } = await api.get("/applications", {
    params,
  });

  return data;
}

export async function getStatistics() {
  const { data } = await api.get(
    "/applications/statistics"
  );

  return data;
}

export async function createApplication(application) {
  const { data } = await api.post(
    "/applications",
    application
  );

  return data;
}

export async function updateApplication(id, application) {
  const { data } = await api.patch(
  `/applications/${id}`,
  application
);

  return data;
}

export async function deleteApplication(id) {
  const { data } = await api.delete(
    `/applications/${id}`
  );

  return data;
}