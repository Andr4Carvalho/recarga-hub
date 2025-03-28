// import { showToast } from "../components/Toast";

export const handleError = (error, customMessage = "Ocorreu um erro inesperado.") => {
  let errorMessage = customMessage;

  if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === "string") {
    errorMessage = error;
  } else if (error?.response?.data?.message) {
    errorMessage = error.response.data.message;
  }

  alert(errorMessage);

  // showToast("Erro!", "error", 5000, errorMessage);
};
