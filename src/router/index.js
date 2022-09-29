import { createRouter, createWebHistory } from 'vue-router'
import panel from "@/pages/panel";

const routes = [
  {
    path: '/',
    name: 'panel',
    component: panel
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
});
export default router
