import React, { useState } from "react";
import axios from "axios";
import HeaderPage from "../header/Header";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SegmentBuilder = (props) => {
  const { onClose } = props;
  const [traitType, setTraitType] = useState("user");
  const [newSchema, setNewSchema] = useState([
    { id: Date.now(), value: "", traits: "" },
  ]);
  const [segmentName, setSegmentName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const schemaOptions = [
    { label: "First Name", value: "first_name" },
    { label: "Last Name", value: "last_name" },
    { label: "Gender", value: "gender" },
    { label: "Age", value: "age" },
    { label: "Account Name", value: "account_name" },
    { label: "City", value: "city" },
    { label: "State", value: "state" },
  ];

  const getAvailableOptionsForNew = () => {
    const selectedValues = newSchema
      .filter((schema) => schema.value)
      .map((schema) => schema.value);

    return schemaOptions.filter(
      (option) => !selectedValues.includes(option.value)
    );
  };

  const handleAddSchema = () => {
    const availableOptions = getAvailableOptionsForNew();
    if (availableOptions.length > 0) {
      setNewSchema([
        ...newSchema,
        {
          id: Date.now(),
          value: "",
          traits: "",
        },
      ]);
    }
  };

  const handleRemoveSchema = (id) => {
    if (newSchema.length > 1) {
      const newSchemas = newSchema.filter(
        (schemaFilter) => schemaFilter?.id !== id
      );
      setNewSchema(newSchemas);
    }
  };

  const getAvailableOptions = (currentSchemaId) => {
    const selectedValues = newSchema
      .filter((schema) => schema.id !== currentSchemaId && schema.value)
      .map((schema) => schema.value);

    const availableOptions = schemaOptions.filter(
      (option) => !selectedValues.includes(option.value)
    );
    const currentSchema = newSchema.find(
      (schema) => schema.id === currentSchemaId
    );
    if (currentSchema && currentSchema.value) {
      const currentOption = schemaOptions.find(
        (opt) => opt.value === currentSchema.value
      );
      if (
        currentOption &&
        !availableOptions.find((opt) => opt.value === currentOption.value)
      ) {
        availableOptions.unshift(currentOption);
      }
    }

    return availableOptions;
  };

  const handleSchemaChange = (schemaId, selectedValue) => {
    const updatedSchemas = newSchema.map((schema) =>
      schema.id === schemaId ? { ...schema, value: selectedValue } : schema
    );
    setNewSchema(updatedSchemas);
  };

  const disAbleAddMoreSchemas = getAvailableOptionsForNew().length > 0;

  const handleSaveSegment = async () => {
    setError("");
    if (!segmentName.trim()) {
      setError("Please enter a segment name");
      return;
    }
    const hasEmptySchemas = newSchema.some(
      (schema) => !schema.value || schema.value.trim() === ""
    );
    if (hasEmptySchemas) {
      setError("Please select a value for all schemas");
      return;
    }

    setIsLoading(true);

    const segmentData = {
      segment_name: segmentName.trim(),
      schema: newSchema.map((schema) => {
        const option = schemaOptions.find((opt) => opt.value === schema.value);
        return { [schema.value]: option?.label };
      }),
    };

    try {
      const response = await axios.post(
        "https://jsonplaceholder.typicode.com/posts",
        segmentData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 10000,
        }
      );

      console.log("API Response:", response.data);

      if (response.status === 200 || 201 || 202) {
        toast.success("Segment saved successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        setTimeout(() => {
          onClose();
        }, 2000);
      }
    } catch (error) {
      toast.error("Failed to save segment. Please try again.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      if (error.response) {
        setError(`Server error: ${error.response.status}`);
      } else if (error.request) {
        setError("Network error: Please check your connection");
      } else {
        setError("Error saving segment: " + error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
        <div className="fixed top-0 right-0 bottom-0 bg-white shadow-lg flex flex-col animate-slide-in-right">
          <HeaderPage
            title="Saving Segment"
            onClose={onClose}
            modalClose={true}
          />
          <div className="flex-1 overflow-auto">
            <div className="p-6">
              <div className="flex flex-col gap-5">
                <label className="text-base">
                  Enter the Name of the Segment
                </label>
                <input
                  placeholder="Name of the segment"
                  value={segmentName}
                  onChange={(e) => setSegmentName(e.target.value)}
                  className="w-4/5 px-5 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#0d939f] "
                />
              </div>

              {error && (
                <div className="text-red-700 bg-red-100 border border-red-400 rounded px-4 py-3 mt-2 text-sm font-medium w-fit">
                  {error}
                </div>
              )}

              <span className="text-base flex mt-5">
                To save your segment, you need to add the schemas to build the
                query
              </span>

              <div className="flex justify-end gap-2 mt-4">
                <span
                  onClick={() => setTraitType("user")}
                  className="cursor-pointer flex items-center"
                >
                  <span className="w-2 h-2 rounded-full bg-green-500 mr-2 mt-1"></span>
                  - User Traits
                </span>
                <span
                  onClick={() => setTraitType("group")}
                  className="cursor-pointer flex items-center"
                >
                  <span className="w-2 h-2 rounded-full bg-red-500 mr-2 mt-1"></span>
                  - Group Traits
                </span>
              </div>

              <div className="flex flex-col gap-5 mt-7">
                {newSchema.map((schema) => {
                  const availableOptions = getAvailableOptions(schema.id);
                  const hasSelectedValue = schema.value && schema.value !== "";

                  return (
                    <div className="flex gap-5 items-center" key={schema.id}>
                      <span
                        className={`w-2 h-2 rounded-full ${
                          traitType === "user" ? "bg-green-500" : "bg-red-500"
                        }`}
                      />
                      <select
                        value={schema.value}
                        onChange={(e) =>
                          handleSchemaChange(schema?.id, e.target.value)
                        }
                        className="w-3/5 px-5 py-2 border border-gray-300 rounded"
                      >
                        {!hasSelectedValue && (
                          <option value="" disabled hidden>
                            Add schema to segment
                          </option>
                        )}
                        {availableOptions.map((data) => (
                          <option key={data?.value} value={data?.value}>
                            {data?.label}
                          </option>
                        ))}
                      </select>
                      {newSchema.length > 1 && (
                        <span
                          className="border border-gray-400 px-3 py-1.5 bg-[#ddf6f9] rounded cursor-pointer"
                          onClick={() => handleRemoveSchema(schema?.id)}
                        >
                          <span className="font-semibold">-</span>
                        </span>
                      )}
                    </div>
                  );
                })}
                {disAbleAddMoreSchemas && (
                  <div
                    className="underline text-[#0d939f] font-bold ml-[10%] w-fit cursor-pointer"
                    onClick={handleAddSchema}
                  >
                    + Add new schema
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="px-6 py-4 border-t border-gray-300 flex gap-3 justify-start bg-gray-200 mt-auto">
            <button
              className="bg-[#0d939f] text-white border-none px-5 py-2 rounded cursor-pointer text-sm font-medium min-w-[140px] disabled:opacity-50"
              onClick={handleSaveSegment}
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save the Segment"}
            </button>
            <button
              className="text-red-500 border-none px-5 py-2 rounded cursor-pointer text-sm font-medium min-w-[80px] bg-white disabled:opacity-50"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SegmentBuilder;
