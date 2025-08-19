import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { CompanyRegisterForm } from '~/types/company';

export const useCompanyRegisterStore = defineStore(
  'companyRegister',
  () => {
    const step = ref(1);
    const form = ref<CompanyRegisterForm>({
      // Step 1
      companyName: '',
      companyEmail: '',
      companyPhone: '',
      companyAddress: '',
      // Step 2
      companyPerson: '',
      companyPersonPhone: '',
      companyUrl: '',
      companyLogo: '',
      // Step 3
      companyCat: '',
      companyIntro: '',
    });

    function updateForm(payload: Partial<CompanyRegisterForm>) {
      form.value = { ...form.value, ...payload };
    }

    return { step, form, updateForm };
  },
  {
    persist: true,
  },
);
