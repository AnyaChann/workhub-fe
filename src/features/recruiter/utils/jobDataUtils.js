// Convert complete job data for API - PRESERVE ORIGINAL BACKEND DATA
export const prepareJobDataForAPI = (formData, originalJob = null) => {
  console.log('🔧 prepareJobDataForAPI input:', formData);
  console.log('🔧 Original job data:', originalJob);

  const result = {
    title: formData.title,
    description: formData.description,
    location: formData.location,
    salaryRange: formData.salaryRange,
    experience: formData.experience,
    deadline: formData.deadline ? `${formData.deadline}T00:00:00` : null,
    
    // ✅ Use original backend objects directly - DON'T CONVERT
    category: originalJob?.category,
    type: originalJob?.type,
    position: originalJob?.position
    
    // DON'T INCLUDE SKILLS - preserve existing ones
  };

  console.log('🔧 prepareJobDataForAPI final result (PRESERVING BACKEND DATA):', result);
  return result;
};

// Alternative: Only send basic fields and let backend preserve entities
export const prepareJobDataForAPIBasic = (formData) => {
  console.log('🔧 prepareJobDataForAPIBasic input:', formData);

  const result = {
    title: formData.title,
    description: formData.description,
    location: formData.location,
    salaryRange: formData.salaryRange,
    experience: formData.experience,
    deadline: formData.deadline ? `${formData.deadline}T00:00:00` : null
    // Don't send category, type, position at all
  };

  console.log('🔧 prepareJobDataForAPIBasic final result:', result);
  return result;
};

// Keep existing display conversion functions unchanged
export const convertCategoryForDisplay = (categoryData) => {
    if (typeof categoryData === 'string') {
        return categoryData;
    }
    if (categoryData && categoryData.name) {
        const displayMappings = {
            'IT': 'Công nghệ thông tin',
            'FINANCE': 'Tài chính',
            'MARKETING': 'Marketing',
            'HR': 'Nhân sự',
            'BUSINESS': 'Kinh doanh',
            'DESIGN': 'Thiết kế'
        };
        return displayMappings[categoryData.name] || categoryData.name;
    }
    return 'Công nghệ thông tin';
};

export const convertTypeForDisplay = (typeData) => {
    if (typeof typeData === 'string') {
        return typeData;
    }
    if (typeData && typeData.name) {
        const displayMappings = {
            'FULL_TIME': 'Full-time',
            'PART_TIME': 'Part-time',
            'CONTRACT': 'Contract',
            'FREELANCE': 'Freelance',
            'INTERNSHIP': 'Internship',
            'REMOTE': 'Remote',
            'HYBRID': 'Hybrid'
        };
        return displayMappings[typeData.name] || typeData.name;
    }
    return 'Full-time';
};

export const convertPositionForDisplay = (positionData) => {
    if (typeof positionData === 'string') {
        return positionData;
    }
    if (positionData && positionData.name) {
        const displayMappings = {
            'JUNIOR': 'Junior',
            'SENIOR': 'Senior',
            'MID_LEVEL': 'Mid-level',
            'LEAD': 'Lead',
            'MANAGER': 'Manager',
            'DIRECTOR': 'Director',
            'INTERN': 'Intern',
            'EXECUTIVE': 'Executive'
        };
        return displayMappings[positionData.name] || positionData.name;
    }
    return 'Junior';
};

export const convertSkillsForDisplay = (skillsData) => {
    if (!skillsData || skillsData.length === 0) {
        return [];
    }

    return skillsData.map(skill => {
        if (typeof skill === 'string') {
            return skill;
        }
        if (skill && skill.name) {
            // Convert from backend enum to display name
            const skillName = skill.name.replace(/_/g, ' ').toLowerCase()
                .replace(/\b\w/g, letter => letter.toUpperCase());
            return skillName;
        }
        return 'Unknown Skill';
    });
};