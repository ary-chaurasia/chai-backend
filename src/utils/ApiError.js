class ApiError extends Error {
  constructor(status, message="Something went wrong",errors=[],stack='') {
    super(message);
    this.status = status;
    this.message = message;
    this.errors = errors; // If errors are provided, use them; otherwise, default to an empty array
    //if (stack) {
     // this.stack = stack;
    //} else {
    //  Error.captureStackTrace(this, this.constructor);
    //}
    //Capture the stack trace if not provided
     if (typeof(Error.captureStackTrace) === 'function') {
    Error.captureStackTrace(this, this.constructor);
  }else{
    this.stack = (new Error(message)).stack;
  }
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

export {ApiError};