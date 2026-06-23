import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import Skeleton from "react-loading-skeleton";

export default function Card({ title, value, icon: Icon, trend, trendValue, color = "indigo", loading }) {
  const colorClasses = {
    indigo: {
      gradient: "from-indigo-500 to-indigo-600",
      bg: "bg-indigo-50",
      text: "text-indigo-600"
    },
    yellow: {
      gradient: "from-yellow-500 to-yellow-600",
      bg: "bg-yellow-50",
      text: "text-yellow-600"
    },
    red: {
      gradient: "from-red-500 to-red-600",
      bg: "bg-red-50",
      text: "text-red-600"
    },
    green: {
      gradient: "from-green-500 to-green-600",
      bg: "bg-green-50",
      text: "text-green-600"
    }
  };

  const colors = colorClasses[color] || colorClasses.indigo;

  return (
    <div className="bg-white h-[20vh] border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 group relative overflow-hidden min-w-[140px]">
      {/* Decorative background element */}
      <div className={`absolute top-0 right-0 w-32 h-30 ${colors.bg} rounded-full -mr-16 -mt-16 opacity-50 group-hover:scale-110 transition-transform duration-500`}></div>
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
            {loading
              ? <Skeleton circle height={30} width={30} />
              : Icon && <Icon className="text-xl text-white" />}
          </div>
          {trend && trendValue && !loading && (
            <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg ${
              trend === "up" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
            }`}>
              {trend === "up" ? (
                <FaArrowUp className="text-xs" />
              ) : (
                <FaArrowDown className="text-xs" />
              )}
              <span className="text-xs font-bold">{trendValue}</span>
            </div>
          )}
        </div>
        
        <p className="text-sm text-gray-500 font-medium mb-2 uppercase tracking-wide">
          {loading ? <Skeleton height={18} width={60} /> : title}
        </p>
        <div className="text-3xl font-bold text-gray-900 group-hover:text-gray-800 transition-colors">
          {loading ? <Skeleton height={30} width={60} /> : value}
        </div>
      </div>
    </div>
  );
}
