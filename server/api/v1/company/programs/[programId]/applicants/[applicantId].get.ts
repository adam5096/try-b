import { defineEventHandler, getRouterParam } from 'h3';

export default defineEventHandler((event) => {
  const programId = getRouterParam(event, 'programId');
  const applicantId = getRouterParam(event, 'applicantId');

  // Based on the provided spec for applicant details
  return {
    name: '蕭宇宏',
    phone: '0900000000',
    age: 31,
    gender: '男',
    identity_id: 3,
    identity_name: '學生',
    address: '基隆市仁愛區123',
    email: 'umit0527@gmail.com',
    headshot: 'headshottest', // You might want to replace this with a real image URL
    participant_serial_num: `AP-${applicantId}`, // Using applicantId for uniqueness
    school_name: '嘉南藥理大學',
    major: '觀光系',
    status_id: 1,
    status_name: '畢業',
    review_count: 2,
    average_score: 3.0,
    program_plan: {
      program_name: '暑期生物體驗營',
      serial_num: `PRJ-${programId}`, // Using programId for uniqueness
      program_start_date: '2025-09-03T00:00:00',
      program_end_date: '2025-09-10T00:00:00',
      program_duration_days: 7,
      address: '台中市中正區仁愛路一段1號',
    },
    motivation_content: '我對這個體驗非常有興趣，希望能學習新技能。',
    Skills: [
      'c#',
      'java',
    ],
    PortfolioFiles: [
      {
        Id: 1,
        title: '眼鏡電商',
        portfolio_path: '/uploads/123.jpg',
        file_size: '10mb',
      },
    ],
    past_programs: [
      {
        program_name: '暑期餐飲體驗營',
        program_start_date: '2025-07-04T00:00:00',
        program_end_date: '2025-08-11T00:00:00',
        participation_status: '已參加',
        cancel_reason: null,
        review_score: 1.0,
      },
      {
        program_name: '暑期科技體驗營',
        program_start_date: '2025-07-02T00:00:00',
        program_end_date: '2025-08-09T00:00:00',
        participation_status: '已參加',
        cancel_reason: null,
        review_score: 5.0,
      },
    ],
  };
});
