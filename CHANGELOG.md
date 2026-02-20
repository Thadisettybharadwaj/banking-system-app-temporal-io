# banking-system-app

## 1.0.0

### Major Changes

- 047bc38: - Developed both frontend and backend systems for real-time money transfers between two accounts.
  - The backend utilizes a temporal workflow to process payments.
  - If the transfer amount exceeds a certain threshold, the workflow execution pauses until it receives a signal from the frontend to either approve or reject the transfer request.
  - In the case of a credit failure during the transfer, the system will attempt to retry the transaction a couple of times. If the credit still fails after these retries, the money will be automatically refunded to the source account.

### Minor Changes

- 3a0d284: Used Claude AI to finish the styling of UI
- 48dda7e: - Finished Creating FrontEnd & BackEnd that displays list of pending requests
  - Used Claude to Make UI more beautifull
  - Fails the transfer request, if not approved with 1 day
