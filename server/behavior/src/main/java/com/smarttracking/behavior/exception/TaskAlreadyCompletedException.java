package com.smarttracking.behavior.exception;

public class TaskAlreadyCompletedException extends Exception {
	public TaskAlreadyCompletedException(String message) {
		super(message);
	}
}
