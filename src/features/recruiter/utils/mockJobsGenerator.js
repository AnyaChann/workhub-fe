export const generateMockJobs = (type = 'mixed', count = 5) => {
  const jobTitles = [
    'Senior Software Engineer',
    'Product Manager', 
    'UX/UI Designer',
    'Data Scientist',
    'DevOps Engineer',
    'Frontend Developer',
    'Backend Developer',
    'Marketing Manager',
    'Sales Representative',
    'Business Analyst',
    'Project Manager',
    'Quality Assurance Engineer',
    'Mobile App Developer',
    'Database Administrator',
    'System Administrator'
  ];

  const companies = [
    'TechCorp Vietnam',
    'ABC Company',
    'XYZ Solutions',
    'Digital Innovations',
    'Future Tech',
    'Smart Systems',
    'Global Solutions',
    'Modern Apps',
    'Cloud Services',
    'Data Dynamics'
  ];

  const locations = [
    'Ho Chi Minh City',
    'Hanoi',
    'Da Nang',
    'Can Tho',
    'Hai Phong',
    'Nha Trang',
    'Hue',
    'Vung Tau'
  ];

  const experiences = ['entry-level', 'mid-level', 'senior-level', 'executive'];
  const jobTypes = [1, 2, 3, 4, 5, 6]; // Full-time, Part-time, Contract, etc.

  const getRandomElement = (array) => array[Math.floor(Math.random() * array.length)];
  
  const getRandomDate = (daysAgo) => {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo));
    return date.toISOString().split('T')[0];
  };

  const getRandomFutureDate = (daysFromNow) => {
    const date = new Date();
    date.setDate(date.getDate() + Math.floor(Math.random() * daysFromNow) + 1);
    return date.toISOString().split('T')[0];
  };

  const generateSalaryRange = () => {
    const ranges = [
      { min: 20000, max: 35000 },
      { min: 35000, max: 50000 },
      { min: 50000, max: 80000 },
      { min: 80000, max: 120000 },
      { min: 120000, max: 200000 }
    ];
    
    const range = getRandomElement(ranges);
    return {
      min: range.min,
      max: range.max,
      type: 'annual',
      display: Math.random() > 0.3 // 70% chance to display salary
    };
  };

  const generateJobStatus = (preferredType) => {
    if (preferredType === 'mixed') {
      return getRandomElement(['active', 'draft', 'expired']);
    }
    return preferredType;
  };

  const generateMockJob = (index, preferredType) => {
    const status = generateJobStatus(preferredType);
    const createdDaysAgo = Math.floor(Math.random() * 30) + 1;
    const updatedDaysAgo = Math.floor(Math.random() * createdDaysAgo);
    
    return {
      id: Date.now() + index,
      title: getRandomElement(jobTitles),
      companyName: getRandomElement(companies),
      location: getRandomElement(locations),
      type_id: getRandomElement(jobTypes),
      experience: getRandomElement(experiences),
      salary_range: generateSalaryRange(),
      status: status,
      created_at: getRandomDate(createdDaysAgo),
      updated_at: getRandomDate(updatedDaysAgo),
      deadline: status === 'expired' ? getRandomDate(10) : getRandomFutureDate(60),
      applications: status === 'draft' ? 0 : Math.floor(Math.random() * 50),
      views: status === 'draft' ? 0 : Math.floor(Math.random() * 200) + 10,
      description: [
        {
          type: 'paragraph',
          children: [
            { text: `We are looking for a talented ${getRandomElement(jobTitles)} to join our team.` }
          ],
        }
      ]
    };
  };

  return Array.from({ length: count }, (_, index) => generateMockJob(index, type));
};

export const generateSingleMockJob = (type = 'active') => {
  return generateMockJobs(type, 1)[0];
};