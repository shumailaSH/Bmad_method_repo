import unittest

from fastapi.testclient import TestClient

from app.main import app


class HealthRouteTest(unittest.TestCase):
    def test_health_endpoint_returns_ok(self) -> None:
        client = TestClient(app)

        response = client.get("/health")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"status": "ok"})
