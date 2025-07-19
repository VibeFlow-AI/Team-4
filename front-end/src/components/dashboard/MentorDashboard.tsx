import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/Navbar';

interface UpcomingSession {
  id: string;
  studentName: string;
  subject: string;
  date: string;
  duration: string;
}

export function MentorDashboard() {
  const [upcomingSessions, setUpcomingSessions] = useState<UpcomingSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch upcoming sessions from API
    const fetchUpcomingSessions = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        const mockSessions: UpcomingSession[] = [
          {
            id: '1',
            studentName: 'Maya Patel',
            subject: 'Physics',
            date: '2024-01-15T10:00:00Z',
            duration: '1 hour'
          },
          {
            id: '2',
            studentName: 'Alex Johnson',
            subject: 'Mathematics',
            date: '2024-01-16T14:00:00Z',
            duration: '1.5 hours'
          }
        ];
        
        setUpcomingSessions(mockSessions);
      } catch (error) {
        console.error('Error fetching upcoming sessions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUpcomingSessions();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="flex items-center justify-center min-h-[calc(100vh-96px)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mentor Dashboard</h1>
          <p className="text-gray-600">Manage your mentoring sessions and profile</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Profile Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-gray-500 font-semibold text-lg">MP</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Dr. Michael Patel</h3>
                  <p className="text-gray-600">Physics & Mathematics Mentor</p>
                  <div className="flex items-center space-x-1 mt-1">
                    <span className="text-yellow-400">★</span>
                    <span className="text-sm text-gray-600">4.9 (127 reviews)</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Experience</p>
                  <p className="font-medium">5+ years</p>
                </div>
                <div>
                  <p className="text-gray-500">Sessions Completed</p>
                  <p className="font-medium">342</p>
                </div>
                <div>
                  <p className="text-gray-500">Students Helped</p>
                  <p className="font-medium">89</p>
                </div>
                <div>
                  <p className="text-gray-500">Availability</p>
                  <p className="font-medium text-green-600">Available</p>
                </div>
              </div>
              
              <Button className="w-full bg-black text-white hover:bg-gray-800">
                Edit Profile
              </Button>
            </CardContent>
          </Card>

          {/* Upcoming Sessions */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingSessions.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-gray-400 mb-4">
                    <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming sessions</h3>
                  <p className="text-gray-500">You don't have any scheduled sessions at the moment.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingSessions.map((session) => (
                    <div key={session.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium text-gray-900">{session.studentName}</h4>
                          <p className="text-sm text-gray-600">{session.subject}</p>
                        </div>
                        <span className="text-sm text-gray-500">{session.duration}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{formatDate(session.date)}</p>
                      <div className="flex space-x-2">
                        <Button size="sm" className="flex-1 bg-black text-white hover:bg-gray-800">
                          Join Session
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          Reschedule
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                <svg className="w-6 h-6 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Schedule Session
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                <svg className="w-6 h-6 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                View Reports
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                <svg className="w-6 h-6 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 