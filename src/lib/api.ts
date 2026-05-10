const API_URL = 'https://ikms-backend-memvhc14t-ibtesam-s-project.vercel.app/api';
export const api = {
  // Get all documents
  getDocuments: async (
    search = '', 
    category = '', 
    department = ''
  ) => {
    const res = await fetch(
      `${API_URL}/documents?search=${search}&category=${category}&department=${department}`
    );
    return res.json();
  },

  // Upload document
  uploadDocument: async (formData: FormData) => {
    const res = await fetch(`${API_URL}/documents`, {
      method: 'POST',
      body: formData,
    });
    return res.json();
  },

  // Delete document
  deleteDocument: async (id: string) => {
    const res = await fetch(`${API_URL}/documents/${id}`, {
      method: 'DELETE',
    });
    return res.json();
  },

  // Get single document
  getDocument: async (id: string) => {
    const res = await fetch(`${API_URL}/documents/${id}`);
    return res.json();
  },
};