import React from 'react'

export default function StatsCard({ icon: Icon, title, value, description, color }) {

    return (
        <div className={`bg-gradient-to-br ${color} rounded-xl p-6 shadow-lg`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-white/80 text-sm font-medium">{title}</p>
                    <p className="text-3xl text-white font-bold mt-1">{value}</p>
                    <p className="text-white/70 text-sm mt-1">{description}</p>
                </div>
                <Icon className="w-8 h-8 text-white/60" />
            </div>
        </div>
    );
}
