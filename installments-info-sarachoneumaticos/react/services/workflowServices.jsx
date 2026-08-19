const WorkflowServices = (instance) => {
  const getAllInstallmentsInfo = () => instance.get(`/_v/get-all-installments-info`);

  const deleteInstallmentsInfo = (id) => instance.delete(`/_v/get-all-installments-info-delete/${id}`);

  return {
    getAllInstallmentsInfo,
    deleteInstallmentsInfo
  };
};

export default WorkflowServices;
