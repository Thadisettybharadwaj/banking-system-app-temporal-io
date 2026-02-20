---
'banking-system-app': major
---

- Developed both frontend and backend systems for real-time money transfers between two accounts.
- The backend utilizes a temporal workflow to process payments.
- If the transfer amount exceeds a certain threshold, the workflow execution pauses until it receives a signal from the frontend to either approve or reject the transfer request.
- In the case of a credit failure during the transfer, the system will attempt to retry the transaction a couple of times. If the credit still fails after these retries, the money will be automatically refunded to the source account.
