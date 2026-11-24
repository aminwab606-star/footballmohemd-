
"use strict";

document.addEventListener("DOMContentLoaded", () => {

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];

  // =====================================
  // 1. القائمة الرئيسية
  // =====================================

  const menuToggle = $("#menu-toggle");
  const navigation = $("#main-navigation");

  if (menuToggle && navigation) {

    menuToggle.addEventListener("click", () => {
      const opened = navigation.classList.toggle("is-open");

      menuToggle.setAttribute("aria-expanded", String(opened));
      menuToggle.setAttribute(
        "aria-label",
        opened ? "إغلاق القائمة" : "فتح القائمة"
      );
    });

    $$("#main-navigation a").forEach(link => {
      link.addEventListener("click", () => {
        navigation.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // =====================================
  // 2. البيانات التعليمية
  // ملاحظة: هذه موارد تجريبية
  // =====================================

  const resources = [

    {
      id: "lesson1",
      title: "مقدمة في الأعداد",
      level: "primary-1",
      subject: "mathematics",
      type: "lessons",
      description: "التعرف على الأعداد وقراءتها.",
      content: "الأعداد تستعمل في العد والقياس والحساب. هذا محتوى تجريبي أولي."
    },

    {
      id: "lesson2",
      title: "الجملة الاسمية",
      level: "primary-5",
      subject: "arabic",
      type: "summaries",
      description: "ملخص حول المبتدأ والخبر.",
      content: "تتكون الجملة الاسمية غالباً من مبتدأ وخبر."
    },

    {
      id: "lesson3",
      title: "العمليات على الكسور",
      level: "middle-1",
      subject: "mathematics",
      type: "exercises",
      description: "تمرين حول الكسور.",
      content: "احسب: 1/2 + 1/4. يجب توحيد المقام قبل الجمع."
    },

    {
      id: "lesson4",
      title: "علوم الحياة والأرض",
      level: "middle-2",
      subject: "life-sciences",
      type: "lessons",
      description: "مقدمة تجريبية في المادة.",
      content: "سيتم إضافة الدروس الكاملة بعد إعداد المحتوى ومراجعته."
    },

    {
      id: "lesson5",
      title: "مفاهيم الفيزياء",
      level: "bac-2",
      subject: "physics",
      type: "summaries",
      description: "مراجعة تجريبية في الفيزياء.",
      content: "هذا مثال أولي وليس ملخصاً كاملاً للمقرر."
    },

    {
      id: "lesson6",
      title: "مدخل إلى الإعلاميات",
      level: "university",
      subject: "computer-science",
      type: "quizzes",
      description: "اختبار تجريبي في الإعلاميات.",
      content: "ما وظيفة نظام التشغيل؟ إدارة موارد الحاسوب وتشغيل التطبيقات."
    }

  ];

  // =====================================
  // 3. أسماء المستويات والمواد
  // =====================================

  const levelNames = {
    "primary-1": "الأول ابتدائي",
    "primary-2": "الثاني ابتدائي",
    "primary-3": "الثالث ابتدائي",
    "primary-4": "الرابع ابتدائي",
    "primary-5": "الخامس ابتدائي",
    "primary-6": "السادس ابتدائي",
    "middle-1": "الأولى إعدادي",
    "middle-2": "الثانية إعدادي",
    "middle-3": "الثالثة إعدادي",
    "common-core": "الجذع المشترك",
    "secondary-1": "الأولى ثانوي",
    "bac-1": "الأولى باكالوريا",
    "bac-2": "الثانية باكالوريا",
    "university": "التعليم الجامعي"
  };

  const subjectNames = {
    arabic: "اللغة العربية",
    french: "اللغة الفرنسية",
    english: "اللغة الإنجليزية",
    mathematics: "الرياضيات",
    physics: "الفيزياء والكيمياء",
    "life-sciences": "علوم الحياة والأرض",
    "history-geography": "الاجتماعيات",
    "islamic-education": "التربية الإسلامية",
    "computer-science": "الإعلاميات",
    "university-major": "تخصص جامعي"
  };

  const typeNames = {
    lessons: "درس",
    summaries: "ملخص",
    exercises: "تمرين",
    quizzes: "اختبار"
  };

  // =====================================
  // 4. عناصر البحث
  // =====================================

  const searchForm = $("#resource-search-form");
  const levelSelect = $("#study-level");
  const subjectSelect = $("#study-subject");
  const searchInput = $("#resource-search");
  const searchHelp = $("#search-help");
  const resourceList = $("#resource-list");

  const tabs = $$(".resource-tab");

  let activeType = "all";
  let filteredResources = resources.slice();

  // =====================================
  // 5. حفظ التقدم
  // =====================================

  const STORAGE_KEY = "footballStudyProgress_v1";

  let completedIds = [];

  try {

    const saved = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || "[]"
    );

    if (Array.isArray(saved)) {
      completedIds = saved.filter(id =>
        resources.some(resource => resource.id === id)
      );
    }

  } catch (error) {
    console.warn("تعذرت قراءة التقدم المحفوظ.", error);
  }

  function saveProgress() {

    try {

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(completedIds)
      );

      return true;

    } catch (error) {

      console.warn("تعذر حفظ التقدم.", error);
      return false;

    }
  }

  // =====================================
  // 6. إنشاء العناصر
  // =====================================

  function createElement(tag, className, text) {

    const element = document.createElement(tag);

    if (className) {
      element.className = className;
    }

    if (text !== undefined) {
      element.textContent = text;
    }

    return element;
  }

  // =====================================
  // 7. عرض التقدم الدراسي
  // =====================================

  function renderProgress() {

    const container = $("#user-progress");

    if (!container) return;

    const total = resources.length;
    const completed = completedIds.length;

    const percentage = total
      ? Math.round((completed / total) * 100)
      : 0;

    container.replaceChildren();

    const icon = createElement("span", "", "💾");

    const details = createElement("div");

    const title = createElement(
      "h3",
      "",
      "تقدمك على هذا الجهاز"
    );

    const description = createElement(
      "p",
      "",
      `أنجزت ${completed} من ${total} موارد تجريبية (${percentage}%).`
    );

    const progress = createElement("progress");

    progress.max = 100;
    progress.value = percentage;

    details.append(title, description, progress);

    container.append(icon, details);

    let resetButton = $("#reset-progress");

    if (!resetButton) {

      resetButton = createElement(
        "button",
        "text-link",
        "إعادة ضبط التقدم"
      );

      resetButton.type = "button";
      resetButton.id = "reset-progress";

      $(".progress-actions")?.append(" ", resetButton);
    }

    if (resetButton) {

      resetButton.onclick = () => {

        if (!confirm("هل تريد إعادة ضبط تقدمك؟")) return;

        completedIds = [];

        saveProgress();
        renderResources(filteredResources);
        renderProgress();

      };
    }
  }

  // =====================================
  // 8. عرض الدروس والموارد
  // =====================================

  function renderResources(items) {

    if (!resourceList) return;

    resourceList.replaceChildren();

    if (items.length === 0) {

      const empty = createElement("div", "empty-state");

      empty.append(
        createElement("span", "", "🔎"),
        createElement("p", "", "لم نعثر على نتائج."),
        createElement("small", "", "جرّب تغيير البحث أو المستوى أو المادة.")
      );

      resourceList.append(empty);

      return;
    }

    items.forEach(resource => {

      const card = createElement(
        "article",
        "content-card resource-card"
      );

      const title = createElement(
        "h3",
        "",
        resource.title
      );

      const metadata = createElement(
        "p",
        "resource-meta",
        `${levelNames[resource.level]} • ${subjectNames[resource.subject]} • ${typeNames[resource.type]}`
      );

      const description = createElement(
        "p",
        "resource-description",
        resource.description
      );

      const content = createElement(
        "p",
        "resource-content",
        resource.content
      );

      content.hidden = true;

      // زر عرض المحتوى

      const detailsButton = createElement(
        "button",
        "button button-secondary",
        "عرض المحتوى"
      );

      detailsButton.type = "button";

      detailsButton.addEventListener("click", () => {

        content.hidden = !content.hidden;

        detailsButton.textContent = content.hidden
          ? "عرض المحتوى"
          : "إخفاء المحتوى";

      });

      // زر إتمام الدرس

      const completeButton = createElement(
        "button",
        "button button-primary",
        completedIds.includes(resource.id)
          ? "تم الإنجاز ✓"
          : "تحديد كمكتمل"
      );

      completeButton.type = "button";

      completeButton.setAttribute(
        "aria-pressed",
        String(completedIds.includes(resource.id))
      );

      completeButton.addEventListener("click", () => {

        if (completedIds.includes(resource.id)) {

          completedIds = completedIds.filter(
            id => id !== resource.id
          );

        } else {

          completedIds.push(resource.id);

        }

        saveProgress();

        renderResources(filteredResources);
        renderProgress();

      });

      const actions = createElement(
        "div",
        "resource-actions"
      );

      actions.append(detailsButton, completeButton);

      card.append(
        title,
        metadata,
        description,
        content,
        actions
      );

      resourceList.append(card);

    });
  }

  // =====================================
  // 9. البحث والتصفية
  // =====================================

  function applyFilters() {

    const selectedLevel = levelSelect?.value || "";
    const selectedSubject = subjectSelect?.value || "";

    const query = (
      searchInput?.value || ""
    ).trim().toLocaleLowerCase("ar");

    filteredResources = resources.filter(resource => {

      const matchesLevel =
        !selectedLevel || resource.level === selectedLevel;

      const matchesSubject =
        !selectedSubject || resource.subject === selectedSubject;

      const matchesType =
        activeType === "all" || resource.type === activeType;

      const searchableText = (
        resource.title + " " +
        resource.description + " " +
        resource.content
      ).toLocaleLowerCase("ar");

      const matchesSearch =
        !query || searchableText.includes(query);

      return (
        matchesLevel &&
        matchesSubject &&
        matchesType &&
        matchesSearch
      );

    });

    renderResources(filteredResources);

    if (searchHelp) {

      searchHelp.textContent =
        `عدد النتائج: ${filteredResources.length}. المحتوى المعروض تجريبي وليس مكتبة دراسية كاملة.`;

    }
  }

  // =====================================
  // 10. تشغيل البحث
  // =====================================

  if (searchForm) {

    searchForm.addEventListener("submit", event => {

      event.preventDefault();

      applyFilters();

      $("#resources")?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

    });
  }

  [levelSelect, subjectSelect].forEach(select => {

    select?.addEventListener("change", applyFilters);

  });

  searchInput?.addEventListener("input", applyFilters);

  // =====================================
  // 11. تصنيف الموارد
  // =====================================

  tabs.forEach(tab => {

    tab.addEventListener("click", () => {

      activeType = tab.dataset.resourceType || "all";

      tabs.forEach(item => {

        const active = item === tab;

        item.classList.toggle("is-active", active);

        item.setAttribute(
          "aria-pressed",
          String(active)
        );

      });

      applyFilters();

    });
  });

  // =====================================
  // 12. اختيار المستوى الدراسي
  // =====================================

  $$(".level-card").forEach(card => {

    card.addEventListener("click", () => {

      const level = card.dataset.level;

      if (levelSelect && level) {

        levelSelect.value = level;

        applyFilters();

      }

    });
  });

  // =====================================
  // 13. قسم كرة القدم
  // =====================================

  const footballStatus = $("#football-data-status");

  if (footballStatus) {

    footballStatus.textContent =
      "لا يوجد مصدر بيانات مباشر مربوط حالياً. المباريات والنتائج والترتيب غير متاحة بعد. لن نعرض بيانات تجريبية على أنها حقيقية.";

  }

  // =====================================
  // 14. تشغيل الموقع
  // =====================================

  applyFilters();

  renderProgress();

  console.info(
    "تم تحميل JavaScript بنجاح."
  );

});
