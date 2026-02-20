---
'banking-system-app': major
---

- Created FrontEnd & BackEnd for Real-time transfer of amount from two accounts
- Backend uses temporal workflow for processing the payements
- If Amount is Greater than certain threshold, workflow execution stops until it gets a signal from the frontEnd, to either approve or reject the transfer request
- If, while transfering, credit fails, then retry couple of times. Even After retrying credit fails, money will be automatically refunded into source account
