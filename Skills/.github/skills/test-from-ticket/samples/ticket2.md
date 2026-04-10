# GitHub Issue: #518

**Labels:** feature, backend, api
**Milestone:** v2.3.0
**Author:** @marco-devops
**Project:** E-Commerce Platform

---

## Summary

Add product inventory reservation during checkout so that items cannot be oversold when multiple users purchase the same low-stock item simultaneously.

---

## Background

We have had several incidents where the same last unit of a product was sold to two different customers simultaneously. We need to implement an inventory reservation step during checkout to prevent this.

---

## Proposed Behaviour

When a user proceeds to the payment step, the requested quantity of each item in their cart should be temporarily reserved for 15 minutes. If payment is not completed within that window, the reservation is released. If payment succeeds, inventory is permanently decremented.

---

## Acceptance Criteria

- [ ] AC1: When a user reaches the payment step, inventory for all cart items is reserved atomically.
- [ ] AC2: If the requested quantity exceeds available stock at reservation time, the user receives a clear error and checkout is blocked.
- [ ] AC3: A reservation expires automatically after 15 minutes and the stock is returned to available inventory.
- [ ] AC4: A second user attempting to reserve the same last unit while it is already reserved receives an "out of stock" error.
- [ ] AC5: On successful payment, inventory is permanently decremented and the reservation record is removed.
- [ ] AC6: On payment failure or cancellation, the reservation is immediately released.
- [ ] AC7: The `/api/inventory/{productId}` endpoint reflects reserved stock separately from available stock.
- [ ] AC8: Reservation operations must be idempotent — retrying the same request does not double-reserve.

---

## Technical Notes

- Use a database-level transaction or optimistic locking to prevent race conditions.
- A `reservations` table should track: `reservation_id`, `product_id`, `quantity`, `user_id`, `expires_at`.
- Background job (cron every 5 min) sweeps expired reservations.

---

## Out of Scope

- Cart-level reservation (reservation only triggers at checkout payment step).
- Multi-warehouse inventory splitting.
