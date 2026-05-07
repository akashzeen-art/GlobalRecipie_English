import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { User, Calendar, Phone, Shield, LogOut, ArrowLeft, CheckCircle } from "lucide-react";
import { useSubscription } from "@/lib/subscription";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function Account() {
  const { detail, msisdn, isSubscribed, deactivate, logout } = useSubscription();
  const [loading, setLoading]   = useState(false);
  const [msg, setMsg]           = useState<{ text: string; success: boolean } | null>(null);
  const [confirm, setConfirm]   = useState(false);
  const navigate                = useNavigate();

  const handleDeactivate = async () => {
    if (!confirm) { setConfirm(true); return; }
    setLoading(true);
    const result = await deactivate();
    setLoading(false);
    setConfirm(false);
    setMsg({ text: result.msg, success: result.success });
    if (result.success) setTimeout(() => navigate("/"), 2000);
  };

  return (
    <div className="bg-black min-h-screen text-white">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-red-600/20 border border-red-500/30 rounded-full flex items-center justify-center">
              <User className="w-7 h-7 text-red-400" />
            </div>
            <div>
              <h1 className="text-2xl font-cinematic text-white">My Account</h1>
              <p className="text-gray-500 text-sm">{msisdn || subid || "Subscriber"}</p>
            </div>
          </div>

          {/* Status */}
          <div className={`p-4 rounded-2xl border flex items-center gap-3 ${isSubscribed ? "bg-green-500/5 border-green-500/20" : "bg-red-500/5 border-red-500/20"}`}>
            <div className={`w-3 h-3 rounded-full animate-pulse ${isSubscribed ? "bg-green-500" : "bg-red-500"}`} />
            <span className={`font-semibold text-sm ${isSubscribed ? "text-green-400" : "text-red-400"}`}>
              {isSubscribed ? "Active Subscription" : "No Active Subscription"}
            </span>
          </div>

          {/* Details */}
          {detail && (
            <div className="bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden">
              <div className="px-5 py-3 border-b border-white/5">
                <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Subscription Details</h2>
              </div>
              <div className="divide-y divide-white/5">
                {[
                  { icon: <Shield className="w-4 h-4 text-red-400" />,     label: "Service",    value: detail.service_name || "On Cook Jour" },
                  { icon: <Phone className="w-4 h-4 text-blue-400" />,     label: "Mobile",     value: detail.msisdn },
                  { icon: <Calendar className="w-4 h-4 text-green-400" />, label: "Valid From", value: detail.valid_from },
                  { icon: <Calendar className="w-4 h-4 text-orange-400" />,label: "Valid To",   value: detail.valid_to },
                ].map((row) => (
                  <div key={row.label} className="flex items-center gap-4 px-5 py-4">
                    {row.icon}
                    <span className="text-gray-500 text-sm w-24">{row.label}</span>
                    <span className="text-white text-sm font-medium">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Message */}
          {msg && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm ${msg.success ? "bg-green-500/10 border-green-500/20 text-green-400" : "bg-red-500/10 border-red-500/20 text-red-400"}`}>
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              {msg.text}
            </motion.div>
          )}

          {/* Actions */}
          <div className="pt-4 border-t border-white/10 space-y-3">
            {isSubscribed && (
              <div>
                <p className="text-gray-500 text-sm mb-3">
                  {confirm ? "⚠️ Are you sure? You will lose access to all content." : "Want to cancel your subscription?"}
                </p>
                <div className="flex items-center gap-3">
                  <button onClick={handleDeactivate} disabled={loading}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all disabled:opacity-50 ${confirm ? "bg-red-600 hover:bg-red-700 text-white" : "bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300"}`}>
                    <LogOut className="w-4 h-4" />
                    {loading ? "Processing..." : confirm ? "Yes, Unsubscribe" : "Unsubscribe"}
                  </button>
                  {confirm && <button onClick={() => setConfirm(false)} className="text-gray-500 hover:text-white text-sm">Cancel</button>}
                </div>
              </div>
            )}

            <button onClick={() => { logout(); navigate("/"); }}
              className="flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white rounded-xl text-sm transition-all">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>

        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
