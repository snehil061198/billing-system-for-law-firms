package com.perfexiolegal.billingsystem.Exceptions;

public class RepositoryException extends Exception {
  public RepositoryException() {
  }

  public RepositoryException(String message) {
    super(message);
  }

  public RepositoryException(String message, Throwable cause) {
    super(message, cause);
  }
}

