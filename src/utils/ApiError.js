class ApiError extends Error {
  constructor(status, message="Something went wrong",errors=[],stack='') {
    super(message);
    this.status = status;
    this.message = message;
    this.errors = errors; // If errors are provided, use them; otherwise, default to an empty array
    this.stack = stack || new Error.captureStackTrace(this,this.constructor); //Capture the stack trace if not provided
    this.data=null,
    this.success=false;
  }

  toJSON() {
    return {
      status: this.status,
      message: this.message,
    };
  }
}

export default ApiError;