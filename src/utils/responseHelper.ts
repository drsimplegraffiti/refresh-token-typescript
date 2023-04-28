import { Response } from "express";
import { responseStatusCodes, Data } from "./reponseInterface";

export class responseHelper {
    public static successResMsg(res: Response, message?: string, data?: Data) {
        res.status(responseStatusCodes.SUCCESS).json({
            status: "success",
            message: message || "Success",
            data: data || {},
        });
    }

    public static createdSuccessResMsg(res: Response, message?: string, data?: Data) {
        res.status(responseStatusCodes.CREATED).json({
            status: "success",
            message: message || "Created Successfully",
            data: data || {},
        });
    }

    public static modifiedSuccessResMsg(res: Response, message?: string, data?: Data) {
        res.status(responseStatusCodes.MODIFIED).json({
            status: "success",
            message: message || "Modified Successfully",
            data: data || {},
        });
    }

    public static noContentSuccessResMsg(res: Response, message?: string) {
        res.status(responseStatusCodes.NO_CONTENT).json({
            status: "success",
            message: message || "No Content",
        });
    }

    public static badRequestResMsg(res: Response, message?: string) {
        res.status(responseStatusCodes.BAD_REQUEST).json({
            status: "error",
            message: message || "Bad Request",
        });
    }

    public static unauthorizedResMsg(res: Response, message?: string) {
        res.status(responseStatusCodes.UNAUTHORIZED).json({
            status: "error",
            message: message || "Unauthorized",
        });
    }

    public static forbiddenResMsg(res: Response, message?: string) {
        res.status(responseStatusCodes.FORBIDDEN).json({
            status: "error",
            message: message || "Forbidden",
        });
    }

    public static notFoundResMsg(res: Response, message?: string) {
        res.status(responseStatusCodes.NOT_FOUND).json({
            status: "error",
            message: message || "Not Found",
        });
    }

    public static conflictResMsg(res: Response, message?: string) {
        res.status(responseStatusCodes.CONFLICT).json({
            status: "error",
            message: message || "Conflict",
        });
    }

    public static unprocessableResMsg(res: Response, message?: string) {
        res.status(responseStatusCodes.UNPROCESSABLE).json({
            status: "error",
            message: message || "Unprocessable",
        });
    }

    public static internalServerErrorResMsg(res: Response, message?: string) {
        res.status(responseStatusCodes.INTERNAL_SERVER_ERROR).json({
            status: "error",
            message: message || "Internal Server Error",
        });
    }

    public static notImplementedResMsg(res: Response, message?: string) {
        res.status(responseStatusCodes.NOT_IMPLEMENTED).json({
            status: "error",
            message: message || "Not Implemented",
        });
    }

    public static appError(res: Response, error: any) {
        res.status(error.statusCode || responseStatusCodes.INTERNAL_SERVER_ERROR).json({
            status: error.status || "error",
            message: error.message || "Internal Server Error",
        });
    }

    public static appErrorWithCode(res: Response, error: any) {
        res.status(error.statusCode || responseStatusCodes.INTERNAL_SERVER_ERROR).json({
            status: error.status || "error",
            message: error.message || "Internal Server Error",
            code: error.code || 0,
        });
    }

    public static appErrorWithErrors(res: Response, error: any) {
        res.status(error.statusCode || responseStatusCodes.INTERNAL_SERVER_ERROR).json({
            status: error.status || "error",
            message: error.message || "Internal Server Error",
            errors: error.errors || {},
        });
    }

    public static appErrorWithCodeAndErrors(res: Response, error: any) {
        res.status(error.statusCode || responseStatusCodes.INTERNAL_SERVER_ERROR).json({
            status: error.status || "error",
            message: error.message || "Internal Server Error",
            code: error.code || 0,
            errors: error.errors || {},
        });
    }

    public static appErrorWithMessageAndErrors(res: Response, error: any) {
        res.status(error.statusCode || responseStatusCodes.INTERNAL_SERVER_ERROR).json({
            status: error.status || "error",
            message: error.message || "Internal Server Error",
            errors: error.errors || {},
        });
    }


}