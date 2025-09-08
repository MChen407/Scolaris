import School from '../models/school.model.js';

export const getSchoolInfo = async (req, res) => {
  try {
    let school = await School.findOne();
    if (!school) {
      school = await School.create({
        name: '',
        logo: '',
        phone: '',
        address: '',
        email: ''
      });
    }
    res.json(school);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateSchoolInfo = async (req, res) => {
  try {
    const { name, logo, phone, address, email } = req.body;
    
    let school = await School.findOne();
    if (!school) {
      school = await School.create({ name, logo, phone, address, email });
    } else {
      await school.update({ name, logo, phone, address, email });
    }
    
    res.json(school);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};