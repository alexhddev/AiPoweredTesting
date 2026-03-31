import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

// TC-19: API — Create Order Input Validation
test.describe('TC-19: API — Create Order Input Validation', () => {
  test('POST /api/orders with missing sender returns error', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/orders`, {
      data: { contents: [{ name: 'Margherita Pizza', quantity: 1 }] },
    });

    const body = await response.json();
    expect(body.success).toBe(false);
    expect(body.message).toBeTruthy();
  });

  test('POST /api/orders with empty contents returns error', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/orders`, {
      data: { sender: 'Alice', contents: [] },
    });

    const body = await response.json();
    expect(body.success).toBe(false);
    expect(body.message).toBeTruthy();
  });

  test('POST /api/orders with missing contents returns error', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/orders`, {
      data: { sender: 'Alice' },
    });

    const body = await response.json();
    expect(body.success).toBe(false);
    expect(body.message).toBeTruthy();
  });
});

// TC-20: API — Invalid Status Update
test.describe('TC-20: API — Invalid Status Update', () => {
  test('PUT /api/orders/:id with unknown status returns error', async ({ request }) => {
    // First create a valid order to get a real ID
    const createResponse = await request.post(`${BASE_URL}/api/orders`, {
      data: {
        sender: 'Alice',
        contents: [{ name: 'Margherita Pizza', quantity: 1 }],
      },
    });
    const createBody = await createResponse.json();
    expect(createBody.success).toBe(true);
    const orderId = createBody.orderId;

    const updateResponse = await request.put(`${BASE_URL}/api/orders/${orderId}`, {
      data: { status: 'UNKNOWN' },
    });

    const updateBody = await updateResponse.json();
    expect(updateBody.success).toBe(false);
    expect(updateBody.message).toBeTruthy();
  });
});
