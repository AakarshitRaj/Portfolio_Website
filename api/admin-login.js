export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  const { password } = req.body;

  if (password === process.env.ADMIN_PASSWORD) {
    const token = Buffer.from(`${Date.now()}-${Math.random()}`).toString("base64");
    return res.status(200).json({ success: true, token });
  }

  res.status(401).json({ success: false, message: "Incorrect password" });
}
