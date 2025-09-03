class ApiResonse {
    constructor(status, message = "Operation successful", data = null, success = true) {
        this.status = status; // HTTP status code
        this.message = message; // Success message
        this.data = data; // Data returned by the API
        this.success = success; // Indicates if the operation was successful
    }
}
export { ApiResonse };