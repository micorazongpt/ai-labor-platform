import React, { useState, useEffect, createContext, useContext } from 'react';
import { Calculator, Clock, DollarSign, Calendar, ChevronRight, X, CheckCircle, Crown, Lock } from 'lucide-react';
import Head from 'next/head';

export default function AILaborPlatform() {
  return (
    <>
      <Head>
        <title>AI노무사 - 무료 퇴직금·연차 계산기</title>
        <meta name="description" content="사장님을 위한 AI 노무 서비스. 퇴직금, 연차, 야근수당을 3초만에 정확하게 계산하세요." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-center text-blue-600 mb-8">
            🤖 AI노무사
          </h1>
          <p className="text-center text-gray-600 mb-8">
            AI 기술로 더 쉽고 정확한 노무 업무를 경험하세요
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {/* 퇴직금 계산기 */}
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mb-4">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">퇴직금 계산기</h3>
              <p className="text-gray-600 mb-4">정확한 퇴직금 계산</p>
              <button className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors">
                계산하기
              </button>
            </div>
            
            {/* 연차 계산기 */}
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">연차 계산기</h3>
              <p className="text-gray-600 mb-4">연차 발생 및 잔여일수</p>
              <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors">
                계산하기
              </button>
            </div>
            
            {/* 야근수당 계산기 */}
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">야근수당 계산기</h3>
              <p className="text-gray-600 mb-4">연장근로 수당 계산</p>
              <button className="w-full bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 transition-colors">
                계산하기
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}