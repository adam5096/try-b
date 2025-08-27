import { defineEventHandler, getRouterParam } from 'h3';

export default defineEventHandler((event) => {
  const programId = getRouterParam(event, 'programId');
  const applicantId = getRouterParam(event, 'applicantId');

  // Based on the provided spec for applicant details
  return {
    review_status_id: 2,
    review_status_name: 'Approved',
    name: '蕭宇宏',
    phone: '0900000000',
    age: 31,
    gender: '男',
    identity_id: 3,
    identity_name: '學生',
    address: '基隆市仁愛區123',
    email: 'umit0527@gmail.com',
    headshot: 'headshottest',
    participant_serial_num: 'PA-2025-0819-005',
    school_name: '嘉南藥理大學',
    major: '觀光系',
    status_id: 1,
    status_name: '畢業',
    review_count: 4,
    average_score: 4.25,
    program_plan: {
      program_name: '暑期戰鬥體驗營',
      serial_num: 'PRJ-20250818-008',
      program_start_date: '2025-10-02T00:00:00',
      program_end_date: '2025-10-08T00:00:00',
      program_duration_days: 7,
      address: '台中市中山區仁愛路一段222號',
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
        program_name: '暑期科技體驗營',
        program_start_date: '2025-08-02T00:00:00',
        program_end_date: '2025-08-09T00:00:00',
        participation_status: 'Attended',
        cancel_reason: null,
        review_score: 5,
      },
      {
        program_name: '暑期生物體驗營',
        program_start_date: '2025-08-18T00:00:00',
        program_end_date: '2025-08-19T00:00:00',
        participation_status: 'Attended',
        cancel_reason: null,
        review_score: 3,
      },
      {
        program_name: '暑期戰鬥體驗營',
        program_start_date: '2025-10-02T00:00:00',
        program_end_date: '2025-10-08T00:00:00',
        participation_status: 'Cancelled',
        cancel_reason: '家裡有事',
        review_score: null,
      },
    ],
  };
});
