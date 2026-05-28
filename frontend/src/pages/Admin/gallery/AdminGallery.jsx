import React, { useEffect, useRef, useState } from "react";
import AdminLayout from "../AdminLayout";
import axios from "axios";
import toast from "react-hot-toast";

const AdminGallery = () => {
  const [images, setImages] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [serviceOptions, setServiceOptions] = useState([]);

  const [newImage, setNewImage] = useState({
    title: "",
    service: "",
    type: "SINGLE",
    description: "",
    isFeatured: false,
    file: null,
    beforeImage: null,
    afterImage: null,
  });

  const titleRef = useRef(null);
  const serviceRef = useRef(null);
  const fileRef = useRef(null);
  const beforeRef = useRef(null);
  const afterRef = useRef(null);

  const resetForm = () => {
    setNewImage({
      title: "",
      service: "",
      type: "SINGLE",
      description: "",
      isFeatured: false,
      file: null,
      beforeImage: null,
      afterImage: null,
    });
  };

  const fetchData = async () => {
    try {
      const res = await axios.get("gallery/gallery");
      setImages(res.data.data || []);
    } catch (error) {
      toast.error("Error fetching gallery data");
      console.error("Fetch gallery data error", error);
    }
  };
  const fetchServices = async () => {
    try {
      const res = await axios.get("service/admin/services");
      const options = res.data.data.map((c) => ({
        value: c.title,
        label: c.title,
      }));
      setServiceOptions(options);
    } catch (err) {
      console.error("Frontend Error Fetching Services:", err);
      toast.error(err.message || "Failed to load services");
    }
  };
  const deleteGalleryImage = (id) => async () => {
    if (!window.confirm("Are you sure you want to delete this gallery item?")) {
      return;
    }
    try {
      const res = await axios.delete(`gallery/admin/${id}`);
      if (res.data.success) {
        toast.success(res.data.message);
        fetchData();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Error deleting gallery item");
      console.error("Delete gallery error", error);
    }
  };

  const validateGalleryForm = () => {
    if (!newImage.title.trim()) {
      toast.error("Title is required");
      titleRef.current?.focus();
      return false;
    }

    if (!newImage.service) {
      toast.error("Service is required");
      serviceRef.current?.focus();
      return false;
    }

    if (newImage.type === "SINGLE" && !newImage.file) {
      toast.error("Image is required");
      fileRef.current?.focus();
      return false;
    }

    if (newImage.type === "BEFORE_AFTER" && !newImage.beforeImage) {
      toast.error("Before image is required");
      beforeRef.current?.focus();
      return false;
    }

    if (newImage.type === "BEFORE_AFTER" && !newImage.afterImage) {
      toast.error("After image is required");
      afterRef.current?.focus();
      return false;
    }

    return true;
  };

  const handleUploadImage = async (e) => {
    e.preventDefault();

    if (!validateGalleryForm()) return;

    const formData = new FormData();

    formData.append("title", newImage.title);
    formData.append("service", newImage.service);
    formData.append("type", newImage.type);
    formData.append("description", newImage.description);
    formData.append("isFeatured", newImage.isFeatured);

    if (newImage.type === "SINGLE") {
      formData.append("file", newImage.file);
    }

    if (newImage.type === "BEFORE_AFTER") {
      formData.append("beforeImage", newImage.beforeImage);
      formData.append("afterImage", newImage.afterImage);
    }

    try {
      const res = await axios.post("gallery/admin/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        toast.success(res.data.message);
        setShowCreateModal(false);
        resetForm();
        fetchData();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error("Gallery upload error", error);
      toast.error("Gallery upload failed.");
    }
  };

  useEffect(() => {
    fetchData();
    fetchServices();
  }, []);

  return (
    <AdminLayout>
      <div className="container-fluid">
        <div className="bg-dark rounded p-4">
          <h4 className="text-white border-bottom pb-2 mb-3 d-flex align-items-center">
            <span className="d-flex align-items-center gap-2">
              <i className="bi bi-images"></i>
              Gallery Management
            </span>

            <div className="ms-auto">
              <button
                className="btn btn-outline-danger d-flex align-items-center gap-2 px-3"
                onClick={() => setShowCreateModal(true)}
              >
                <i className="bi bi-plus-circle"></i>
                Upload Gallery Item
              </button>
            </div>
          </h4>

          <div style={{ maxHeight: "65vh", overflowY: "auto" }}>
            <table className="table table-dark table-hover table-bordered align-middle">
              <thead className="table-secondary text-dark sticky-top">
                <tr>
                  <th>#</th>
                  <th>Preview</th>
                  <th>Type</th>
                  <th>Service</th>
                  <th>Title</th>
                  <th>Featured</th>
                  <th>Status</th>
                  <th>Created At</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {images.length > 0 ? (
                  images.map((item, index) => (
                    <tr key={item._id}>
                      <td>{index + 1}</td>

                      <td style={{ width: "170px" }}>
                        {item.type === "SINGLE" ? (
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            style={{
                              width: "90px",
                              height: "60px",
                              objectFit: "cover",
                              borderRadius: "8px",
                            }}
                          />
                        ) : (
                          <div className="d-flex gap-2">
                            <img
                              src={item.beforeImage?.url}
                              alt="Before"
                              style={{
                                width: "70px",
                                height: "55px",
                                objectFit: "cover",
                                borderRadius: "8px",
                              }}
                            />
                            <img
                              src={item.afterImage?.url}
                              alt="After"
                              style={{
                                width: "70px",
                                height: "55px",
                                objectFit: "cover",
                                borderRadius: "8px",
                              }}
                            />
                          </div>
                        )}
                      </td>

                      <td>
                        {item.type === "BEFORE_AFTER" ? (
                          <span className="badge bg-danger">BEFORE / AFTER</span>
                        ) : (
                          <span className="badge bg-info">SINGLE</span>
                        )}
                      </td>

                      <td>{item.service}</td>
                      <td>{item.title || "-"}</td>

                      <td>
                        {item.isFeatured ? (
                          <span className="badge bg-warning text-dark">YES</span>
                        ) : (
                          <span className="badge bg-secondary">NO</span>
                        )}
                      </td>

                      <td>
                        {item.isActive ? (
                          <span className="badge bg-success">ACTIVE</span>
                        ) : (
                          <span className="badge bg-danger">INACTIVE</span>
                        )}
                      </td>

                      <td>{new Date(item.createdAt).toLocaleDateString()}</td>

                      <td className="text-center">
                        <i
                          onClick={deleteGalleryImage(item._id)}
                          className="bi bi-trash text-danger"
                          style={{ cursor: "pointer", fontSize: "18px" }}
                          title="Delete"
                        ></i>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="text-center text-white">
                      No Data Found...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showCreateModal && (
        <div
          className="modal fade show"
          style={{
            display: "block",
            background: "rgba(0,0,0,0.75)",
          }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content bg-dark text-white border-secondary">
              <div className="modal-header border-secondary">
                <h5 className="modal-title">
                  <i className="bi bi-images me-2 text-danger"></i>
                  Upload Gallery Item
                </h5>

                <button
                  className="btn-close btn-close-white"
                  onClick={() => {
                    setShowCreateModal(false);
                    resetForm();
                  }}
                ></button>
              </div>

              <form onSubmit={handleUploadImage}>
                <div className="modal-body p-3 border-secondary">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label>Gallery Type*</label>
                      <select
                        className="form-control mt-2 bg-dark text-white"
                        value={newImage.type}
                        onChange={(e) =>
                          setNewImage({
                            ...newImage,
                            type: e.target.value,
                            file: null,
                            beforeImage: null,
                            afterImage: null,
                          })
                        }
                      >
                        <option value="SINGLE">Single Image</option>
                        <option value="BEFORE_AFTER">Before / After</option>
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label>Select Service*</label>
                      <select
                        name="service"
                        className="form-control mt-2 bg-dark text-white"
                        value={newImage.service}
                        onChange={(e) =>
                          setNewImage((prev) => ({
                            ...prev,
                            service: e.target.value,
                          }))
                        }
                        ref={serviceRef}
                      >
                        <option value="">Select Service</option>
                        {serviceOptions.map((opt, index) => (
                          <option key={index} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-8">
                      <label>Enter Title*</label>
                      <input
                        type="text"
                        className="form-control mt-2 bg-dark text-white"
                        value={newImage.title}
                        onChange={(e) =>
                          setNewImage({ ...newImage, title: e.target.value })
                        }
                        ref={titleRef}
                      />
                    </div>

                    <div className="col-md-4">
                      <label>Featured On Home?</label>
                      <select
                        className="form-control mt-2 bg-dark text-white"
                        value={newImage.isFeatured ? "true" : "false"}
                        onChange={(e) =>
                          setNewImage({
                            ...newImage,
                            isFeatured: e.target.value === "true",
                          })
                        }
                      >
                        <option value="false">No</option>
                        <option value="true">Yes</option>
                      </select>
                    </div>

                    {newImage.type === "SINGLE" && (
                      <div className="col-12">
                        <label>Upload Image*</label>
                        <input
                          type="file"
                          accept="image/*"
                          className="form-control mt-2 bg-dark text-white"
                          onChange={(e) =>
                            setNewImage({
                              ...newImage,
                              file: e.target.files[0],
                            })
                          }
                          ref={fileRef}
                        />
                      </div>
                    )}

                    {newImage.type === "BEFORE_AFTER" && (
                      <>
                        <div className="col-md-6">
                          <label>Upload Before Image*</label>
                          <input
                            type="file"
                            accept="image/*"
                            className="form-control mt-2 bg-dark text-white"
                            onChange={(e) =>
                              setNewImage({
                                ...newImage,
                                beforeImage: e.target.files[0],
                              })
                            }
                            ref={beforeRef}
                          />
                        </div>

                        <div className="col-md-6">
                          <label>Upload After Image*</label>
                          <input
                            type="file"
                            accept="image/*"
                            className="form-control mt-2 bg-dark text-white"
                            onChange={(e) =>
                              setNewImage({
                                ...newImage,
                                afterImage: e.target.files[0],
                              })
                            }
                            ref={afterRef}
                          />
                        </div>
                      </>
                    )}

                    <div className="col-12">
                      <label>Description</label>
                      <textarea
                        rows="3"
                        className="form-control mt-2 bg-dark text-white"
                        value={newImage.description}
                        onChange={(e) =>
                          setNewImage({
                            ...newImage,
                            description: e.target.value,
                          })
                        }
                      ></textarea>
                    </div>
                  </div>
                </div>

                <div className="modal-footer border-secondary">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowCreateModal(false);
                      resetForm();
                    }}
                  >
                    Cancel
                  </button>

                  <button type="submit" className="btn btn-danger">
                    Upload
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminGallery;