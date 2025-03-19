const getCurrentUserRole = () => {
    let role_id;
    const token = localStorage.getItem("jwt");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        role_id = payload.role_id;
      } catch (error) {
        console.error("Error al decodificar el token:", error);
        role_id = null;
      }
    }
    return role_id;
};

const getCurrentUserID = () => {
    let user_id;
    const token = localStorage.getItem("jwt");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        user_id = payload.user_id;
      } catch (error) {
        console.error("Error al decodificar el token:", error);
        user_id = null;
      }
    }
    return user_id;
};

const errorLog = async (err) => {
    console.error("ERROR IN REQUEST:", {
        message: err.message,
        response: err.response,
        request: err.request,
        config: err.config
    });
};

export default{
    getCurrentUserRole,
    getCurrentUserID,
    errorLog
}