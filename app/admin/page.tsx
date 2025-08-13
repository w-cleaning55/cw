import SoftUIDashboard from "../../components/dashboard/SoftUIDashboard";
import SoftUICharts from "../../components/dashboard/SoftUICharts";

export default function AdminPage() {
  return (
    <SoftUIDashboard>
      <div className="mt-8">
        <SoftUICharts />
      </div>
    </SoftUIDashboard>
  );
}
