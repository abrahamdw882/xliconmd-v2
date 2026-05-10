import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ status: false, message: "Use POST" });
  }

  try {
    const EXTERNAL_API = 'https://emam-api-test.vercel.app/home/sections/Tools/api/imageEditPro';
    const response = await axios({
      method: 'POST',
      url: `${EXTERNAL_API}/process-image`,
      data: req.body,
      headers: {
        ...req.headers,
        host: 'emam-api-test.vercel.app'
      },
      maxBodyLength: Infinity,
      maxContentLength: Infinity
    });

    const { recordId } = response.data;
    
    if (!recordId) {
      throw new Error('No record ID received');
    }
    
    // Poll and return result
    let result = null;
    for (let i = 0; i < 40; i++) {
      await new Promise(r => setTimeout(r, 3000));
      const check = await axios.get(`${EXTERNAL_API}/check-result?rid=${recordId}`, {
        responseType: 'arraybuffer'
      });
      
      if (check.headers['content-type']?.includes('image')) {
        result = check.data;
        break;
      }
    }

    if (!result) throw new Error('Timeout - processing took too long');
    
    // Return as base64
    res.json({
      status: true,
      data: { image: Buffer.from(result).toString('base64') }
    });

  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
}
