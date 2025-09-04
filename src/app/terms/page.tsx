import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service | Lango.ai',
  description: 'Terms of Service for Lango.ai - Learn about the terms and conditions for using our language learning platform.',
}

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="prose prose-lg max-w-none">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>
          
          <p className="text-gray-600 mb-8">
            <strong>Effective Date:</strong> {new Date().toLocaleDateString()}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              Welcome to Lango.ai (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;). These Terms of Service (&ldquo;Terms&rdquo;) govern your use of our website located at https://lango.ai and our language learning services (collectively, the &ldquo;Service&rdquo;). By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any part of these terms, you may not access the Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Description of Service</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Lango.ai provides an AI-powered language learning platform that offers:
            </p>
            <ul className="list-disc pl-6 text-gray-700">
              <li>Interactive language lessons and exercises</li>
              <li>Personalized learning paths and recommendations</li>
              <li>Progress tracking and analytics</li>
              <li>Community features and social learning tools</li>
              <li>Premium subscription services with additional features</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. User Accounts</h2>
            
            <h3 className="text-xl font-medium text-gray-900 mb-3">3.1 Account Creation</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              To access certain features of our Service, you must create an account. You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate, current, and complete.
            </p>

            <h3 className="text-xl font-medium text-gray-900 mb-3">3.2 Account Security</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              You are responsible for safeguarding your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
            </p>

            <h3 className="text-xl font-medium text-gray-900 mb-3">3.3 Account Termination</h3>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to suspend or terminate your account at any time for violation of these Terms or for any other reason at our sole discretion.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Acceptable Use</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              You agree not to use the Service to:
            </p>
            <ul className="list-disc pl-6 text-gray-700">
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe upon the rights of others</li>
              <li>Upload or transmit harmful, offensive, or inappropriate content</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Interfere with or disrupt the Service or servers</li>
              <li>Use automated systems to access the Service without permission</li>
              <li>Reverse engineer or attempt to extract source code</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Subscription and Payment Terms</h2>
            
            <h3 className="text-xl font-medium text-gray-900 mb-3">5.1 Subscription Plans</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              We offer various subscription plans with different features and pricing. Subscription fees are billed in advance on a recurring basis according to your chosen plan.
            </p>

            <h3 className="text-xl font-medium text-gray-900 mb-3">5.2 Payment Processing</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Payments are processed through secure third-party payment processors. You agree to provide accurate payment information and authorize us to charge your chosen payment method.
            </p>

            <h3 className="text-xl font-medium text-gray-900 mb-3">5.3 Refunds and Cancellation</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              You may cancel your subscription at any time. Refunds are provided according to our refund policy, which may vary by jurisdiction and circumstances.
            </p>

            <h3 className="text-xl font-medium text-gray-900 mb-3">5.4 Price Changes</h3>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to modify subscription prices with reasonable notice. Price changes will not affect your current billing cycle.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Intellectual Property Rights</h2>
            
            <h3 className="text-xl font-medium text-gray-900 mb-3">6.1 Our Content</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              The Service and its original content, features, and functionality are owned by Lango.ai and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
            </p>

            <h3 className="text-xl font-medium text-gray-900 mb-3">6.2 User Content</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              You retain ownership of any content you submit to the Service. By submitting content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, and distribute such content in connection with the Service.
            </p>

            <h3 className="text-xl font-medium text-gray-900 mb-3">6.3 Feedback</h3>
            <p className="text-gray-700 leading-relaxed">
              Any feedback, suggestions, or ideas you provide to us may be used by us without any obligation to compensate you.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Privacy and Data Protection</h2>
            <p className="text-gray-700 leading-relaxed">
              Your privacy is important to us. Our collection and use of personal information is governed by our Privacy Policy, which is incorporated into these Terms by reference. Please review our Privacy Policy to understand our practices.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Disclaimers and Limitations of Liability</h2>
            
            <h3 className="text-xl font-medium text-gray-900 mb-3">8.1 Service Availability</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              We strive to maintain the Service, but we do not guarantee uninterrupted or error-free operation. The Service is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without warranties of any kind.
            </p>

            <h3 className="text-xl font-medium text-gray-900 mb-3">8.2 Learning Outcomes</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              While we aim to provide effective language learning tools, we do not guarantee specific learning outcomes or proficiency levels. Individual results may vary based on effort, consistency, and other factors.
            </p>

            <h3 className="text-xl font-medium text-gray-900 mb-3">8.3 Limitation of Liability</h3>
            <p className="text-gray-700 leading-relaxed">
              To the maximum extent permitted by law, Lango.ai shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Indemnification</h2>
            <p className="text-gray-700 leading-relaxed">
              You agree to defend, indemnify, and hold harmless Lango.ai and its officers, directors, employees, and agents from and against any claims, damages, obligations, losses, liabilities, costs, or debt arising from your use of the Service or violation of these Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Governing Law and Dispute Resolution</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              These Terms shall be governed by and construed in accordance with the laws of [Jurisdiction], without regard to its conflict of law provisions. Any disputes arising under these Terms shall be resolved through binding arbitration or in the courts of [Jurisdiction].
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Changes to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect. Your continued use of the Service after such changes constitutes acceptance of the new Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Severability</h2>
            <p className="text-gray-700 leading-relaxed">
              If any provision of these Terms is held to be unenforceable or invalid, such provision will be changed and interpreted to accomplish the objectives of such provision to the greatest extent possible under applicable law, and the remaining provisions will continue in full force and effect.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Contact Information</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 mb-2">
                <strong>Email:</strong> legal@lango.ai
              </p>
              <p className="text-gray-700">
                <strong>Website:</strong> https://lango.ai/terms
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}