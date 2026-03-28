import type { Metadata } from "next";
import { ShieldCheck, AlertTriangle } from "lucide-react";

export const metadata: Metadata = { title: "Compliance" };

const CERTIFICATIONS = [
    { name: "NPOP Organic Certification", issuer: "APEDA", expiry: "2026-03-31", status: "active" },
    { name: "FSSAI License", issuer: "FSSAI", expiry: "2025-09-30", status: "expiring" },
    { name: "Legal Metrology Registration", issuer: "Dept. of Consumer Affairs", expiry: "2027-01-01", status: "active" },
    { name: "GST Registration", issuer: "GSTN", expiry: "N/A", status: "active" },
    { name: "Import-Export Code", issuer: "DGFT", expiry: "N/A", status: "active" },
];

export default function CompliancePage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-forest font-display">Compliance</h1>
                <p className="text-sm text-gray-500 mt-0.5">
                    Certifications, documentation, and regulatory status
                </p>
            </div>

            <div className="admin-card overflow-hidden">
                <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
                    <ShieldCheck className="h-4 w-4 text-forest" />
                    <h2 className="text-sm font-semibold text-gray-700">Certifications & Licenses</h2>
                </div>
                <table className="min-w-full">
                    <thead>
                        <tr>
                            <th className="table-th">Certification</th>
                            <th className="table-th">Issuing Authority</th>
                            <th className="table-th">Expiry</th>
                            <th className="table-th">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {CERTIFICATIONS.map((cert) => (
                            <tr key={cert.name} className="hover:bg-gray-50/60">
                                <td className="table-td font-medium text-gray-800">{cert.name}</td>
                                <td className="table-td text-gray-600">{cert.issuer}</td>
                                <td className="table-td text-gray-600">{cert.expiry}</td>
                                <td className="table-td">
                                    {cert.status === "active" ? (
                                        <span className="flex items-center gap-1.5 text-xs text-green-700 bg-green-100 px-2 py-0.5 rounded-full w-fit font-medium">
                                            <ShieldCheck className="h-3 w-3" />
                                            Active
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1.5 text-xs text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full w-fit font-medium">
                                            <AlertTriangle className="h-3 w-3" />
                                            Expiring Soon
                                        </span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
