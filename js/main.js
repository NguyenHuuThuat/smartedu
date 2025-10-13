// js/main.js
document.addEventListener('DOMContentLoaded', function(){
  // AOS init
  if (window.AOS) AOS.init({ duration: 800, once: true });

  // Helper: get query param
  function getQueryParam(name) {
    const url = new URL(window.location.href);
    return url.searchParams.get(name);
  }

  /* Generic AJAX form submit to Formspree */
  function ajaxFormSubmit(formEl) {
    formEl.addEventListener('submit', function(e){
      e.preventDefault();
      const url = formEl.action;
      const formData = new FormData(formEl);
      fetch(url, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      }).then(resp => {
        if (resp.ok) {
          alert('Cảm ơn! Chúng tôi sẽ liên hệ bạn sớm.');
          formEl.reset();
        } else {
          return resp.json().then(data => { throw new Error('Không gửi được') });
        }
      }).catch(err => {
        alert('Gửi không thành công. Vui lòng thử lại hoặc gọi hotline.');
        console.error(err);
      });
    });
  }

  // Attach ajax submit for available forms
  const forms = document.querySelectorAll('form');
  forms.forEach(f => ajaxFormSubmit(f));

  /* --------------------------
     Course detail population
     -------------------------- */
  const courseId = getQueryParam('id');
  if (courseId && document.body.contains(document.getElementById('course_title'))) {
    // Sample course database (you can expand)
    const db = {
      'toan-thcs': {
        title: 'Toán THCS (Cơ bản)',
        sub: 'Củng cố nền tảng, tư duy logic và kiến thức chương trình.',
        banner: 'images/course_math.jpg',
        goals: ['Nắm chắc kiến thức cơ bản', 'Rèn tư duy giải toán', 'Tự giải các dạng bài kiểm tra'],
        outline: ['Đại số: đại lượng và phương trình', 'Hình học: cơ bản và ứng dụng', 'Bài tập ôn luyện và kiểm tra'],
        duration: '40 buổi',
        price: '2.500.000 VND',
        teacher: 'GV Toán – ThS. Nguyễn A',
        start: 'Liên hệ để biết lịch khai giảng'
      },
      'toan-thpt': {
        title: 'Toán THPT (Nâng cao)',
        sub: 'Luyện đề và nâng cao tư duy cho kỳ thi tuyển sinh.',
        banner: 'images/course_math.jpg',
        goals: ['Giải tốt đề thi', 'Nâng cao tư duy hình học', 'Chiến lược làm bài thi'],
        outline: ['Số học & đại số nâng cao', 'Hình học phẳng & không gian', 'Luyện đề chuyên sâu'],
        duration: '40 buổi',
        price: '2.800.000 VND',
        teacher: 'ThS. Trần B',
        start: '01/11/2025 (dự kiến)'
      },
      'python-thcs': {
        title: 'Python cơ bản (THCS)',
        sub: 'Làm quen ngôn ngữ Python & tư duy lập trình cơ bản.',
        banner: 'images/course_python.jpg',
        goals: ['Hiểu cú pháp Python cơ bản', 'Rèn tư duy thuật toán', 'Hoàn thành project nhỏ'],
        outline: ['Biến, kiểu dữ liệu', 'Vòng lặp & điều kiện', 'Hàm, list, project mini'],
        duration: '24 buổi',
        price: '2.000.000 VND',
        teacher: 'ThS. Lê C (AI & Python)',
        start: 'Liên hệ để biết lịch'
      },
      'python-pro': {
        title: 'Python & AI cho sinh viên',
        sub: 'Từ Python pro đến ứng dụng AI & project thực tế.',
        banner: 'images/course_python.jpg',
        goals: ['Python nâng cao', 'Ứng dụng thư viện (Pandas, sklearn)', 'Xây dựng portfolio'],
        outline: ['Python pro', 'Data basics', 'Machine Learning cơ bản', 'Project thực tế'],
        duration: '40 buổi',
        price: '4.000.000 VND',
        teacher: 'TS. Phạm D',
        start: '01/12/2025 (dự kiến)'
      },
      'eng-thcs': {
        title: 'Anh văn THCS (Cơ bản)',
        sub: 'Phát triển kỹ năng 4 kỹ năng cho học sinh.',
        banner: 'images/course_english.jpg',
        goals: ['Nghe & nói cơ bản', 'Từ vựng theo chủ đề', 'Ngữ pháp căn bản'],
        outline: ['Phát âm & luyện nghe', 'Từ vựng & cấu trúc', 'Luyện tập theo chủ đề'],
        duration: '30 buổi',
        price: '2.500.000 VND',
        teacher: 'GV IELTS 8.0',
        start: 'Liên hệ'
      },
      'ielts': {
        title: 'IELTS / Cambridge',
        sub: 'Chuẩn đầu ra, chiến lược thi và kỹ năng nâng cao.',
        banner: 'images/course_english.jpg',
        goals: ['Band target', 'Chiến lược thi từng kỹ năng', 'Mock test thực tế'],
        outline: ['Listening techniques', 'Writing task 1 & 2', 'Speaking practice'],
        duration: '30 buổi',
        price: '3.200.000 VND',
        teacher: 'GV IELTS 8.0+',
        start: 'Liên hệ'
      }
    };

    const course = db[courseId];
    if (course) {
      // Fill fields
      const setText = (id, text) => { const el = document.getElementById(id); if(el) el.textContent = text; };
      setText('course_title', course.title);
      setText('course_sub', course.sub);
      setText('course_duration', course.duration);
      setText('course_price', course.price);
      setText('course_teacher', course.teacher);
      setText('course_start', course.start);
      // banner
      const bannerImg = document.getElementById('course_banner_img');
      if (bannerImg) bannerImg.src = course.banner;
      // goals & outline
      const goalsEl = document.getElementById('course_goals');
      const outlineEl = document.getElementById('course_outline');
      if (goalsEl) { goalsEl.innerHTML = ''; course.goals.forEach(g => { const li = document.createElement('li'); li.textContent = g; goalsEl.appendChild(li); }); }
      if (outlineEl) { outlineEl.innerHTML = ''; course.outline.forEach(o => { const li = document.createElement('li'); li.textContent = o; outlineEl.appendChild(li); }); }
      // form hidden course id
      const hidden1 = document.getElementById('form_course_id'); if (hidden1) hidden1.value = courseId;
      const hidden2 = document.getElementById('detailed_course_id'); if (hidden2) hidden2.value = courseId;
    } else {
      // fallback
      console.warn('Course id not found:', courseId);
    }
  }

  /* --------------------------
     Blog post population
     -------------------------- */
  const slug = getQueryParam('slug');
  if (slug && document.body.contains(document.getElementById('post_title'))) {
    // Example posts DB (expand as needed)
    const posts = {
      'meo-toan': {
        title: '5 mẹo giúp con học Toán online hiệu quả',
        image: 'images/blog1.jpg',
        meta: '10/09/2025 • SmartEdu',
        content: `<p>Học online cần sự chủ động và môi trường phù hợp. Dưới đây 5 mẹo nhỏ giúp con học Toán hiệu quả...</p><h3>1. Thiết lập thời gian học cố định</h3><p>...</p><h3>2. Chia bài tập nhỏ</h3><p>...</p>`
      },
      'python-tu-duy': {
        title: 'Python giúp rèn tư duy logic như thế nào?',
        image: 'images/blog2.jpg',
        meta: '05/08/2025 • SmartEdu',
        content: `<p>Python là ngôn ngữ thân thiện cho người mới. Nó giúp học sinh hình thành tư duy giải quyết vấn đề...</p>`
      },
      'ai-hoc': {
        title: 'AI có thật sự khó học không?',
        image: 'images/blog3.jpg',
        meta: '21/07/2025 • SmartEdu',
        content: `<p>AI không phải là “bí mật”, bắt đầu từ toán cơ bản, Python, rồi đến project nhỏ...</p>`
      }
    };

    const post = posts[slug];
    if (post) {
      const setEl = (id, html) => { const el = document.getElementById(id); if (el) el.innerHTML = html; };
      setEl('post_title', post.title);
      setEl('post_meta', post.meta);
      const img = document.getElementById('post_image'); if (img) img.src = post.image;
      setEl('post_content', post.content);
    } else {
      console.warn('Post not found:', slug);
    }
  }

});
