import SoftUIDashboard from "../../../components/dashboard/SoftUIDashboard";
import BookingCalendar from "@/components/admin/BookingCalendar";

export default function BookingsPage() {
  return (
    <SoftUIDashboard>
      <div className="space-y-6">
        <BookingCalendar />
      </div>
    </SoftUIDashboard>
  );
}
