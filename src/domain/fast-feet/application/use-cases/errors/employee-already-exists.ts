import type { UseCaseError } from "src/core/errors/use-case-error";

export class EmployeeAlreadyExists extends Error implements UseCaseError {
	constructor(identifier: string) {
		super(`Employee ${identifier} already exists.`)
	}
}
