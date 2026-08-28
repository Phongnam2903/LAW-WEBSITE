import type { Metadata } from "next";
import { NotFoundSection } from "@/components/shared/NotFoundSection";

export const metadata: Metadata = {
  title: "404 - Không tìm thấy trang",
};

export default function NotFound() {
  return <NotFoundSection />;
}
