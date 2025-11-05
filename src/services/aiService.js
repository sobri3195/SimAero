const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;

export const aiService = {
  async generateSOAPForm(chiefComplaint) {
    const prompt = `Sebagai asisten medis, berikan pengisian form SOAP lengkap berdasarkan keluhan: "${chiefComplaint}". 
    Berikan dalam format JSON:
    {
      "subjective": "...",
      "objective": "...",
      "assessment": "... (termasuk kode ICD-10)",
      "plan": "...",
      "prescription": ["obat1", "obat2"]
    }`;

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7
        })
      });

      const data = await response.json();
      return JSON.parse(data.choices[0].message.content);
    } catch (error) {
      console.error('AI Error:', error);
      return null;
    }
  },

  async suggestTriage(complaint, vitals) {
    const prompt = `Sebagai perawat IGD, tentukan kategori triase untuk pasien dengan keluhan: "${complaint}" dan tanda vital: ${JSON.stringify(vitals)}. 
    Pilih: RESUSITASI, DARURAT, MENDESAK, atau TIDAK_MENDESAK. Berikan alasan singkat.`;

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.5
        })
      });

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('AI Error:', error);
      return null;
    }
  },

  async recommendBeds(patientCondition, availableBeds) {
    const prompt = `Rekomendasikan 3 tempat tidur terbaik untuk pasien dengan kondisi: "${patientCondition}" dari daftar tempat tidur tersedia: ${JSON.stringify(availableBeds)}. 
    Pertimbangkan spesialisasi dan kondisi pasien.`;

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7
        })
      });

      const data = await response.json();
      return JSON.parse(data.choices[0].message.content);
    } catch (error) {
      console.error('AI Error:', error);
      return null;
    }
  },

  async checkDrugInteractions(medications) {
    const prompt = `Analisis interaksi obat dari daftar: ${JSON.stringify(medications)}. 
    Berikan dalam format JSON:
    {
      "hasInteractions": true/false,
      "interactions": [{
        "drugs": ["obat1", "obat2"],
        "severity": "RINGAN/SEDANG/BERAT",
        "description": "...",
        "recommendation": "..."
      }]
    }`;

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.3
        })
      });

      const data = await response.json();
      return JSON.parse(data.choices[0].message.content);
    } catch (error) {
      console.error('AI Error:', error);
      return null;
    }
  },

  async analyzeRadiologyImage(imageDescription) {
    const prompt = `Sebagai radiolog, analisis gambar radiologi dengan deskripsi: "${imageDescription}". 
    Berikan dalam format JSON:
    {
      "findings": "...",
      "impression": "...",
      "recommendations": "...",
      "urgency": "NORMAL/PERLU_PERHATIAN/DARURAT"
    }`;

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.5
        })
      });

      const data = await response.json();
      return JSON.parse(data.choices[0].message.content);
    } catch (error) {
      console.error('AI Error:', error);
      return null;
    }
  },

  async generateSchedule(requirements, availableStaff) {
    const prompt = `Buat jadwal shift berdasarkan kebutuhan: "${requirements}" dan staff tersedia: ${JSON.stringify(availableStaff)}. 
    Berikan jadwal mingguan dalam format JSON dengan struktur:
    {
      "schedule": {
        "Senin": { "pagi": [], "siang": [], "malam": [] },
        ...
      }
    }`;

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7
        })
      });

      const data = await response.json();
      return JSON.parse(data.choices[0].message.content);
    } catch (error) {
      console.error('AI Error:', error);
      return null;
    }
  },

  async analyzeHealthData(question, context) {
    const prompt = `Sebagai analis data kesehatan, jawab pertanyaan: "${question}" berdasarkan data: ${JSON.stringify(context)}`;

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.5
        })
      });

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('AI Error:', error);
      return null;
    }
  }
};
