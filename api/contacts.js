export default async function handler(req, res) {
  try {
    const response = await fetch(process.env.GOOGLE_SCRIPT_URL);
    const data = await response.json();
    res.status(200).json({ success: true, contacts: data });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch contacts" });
  }
}
