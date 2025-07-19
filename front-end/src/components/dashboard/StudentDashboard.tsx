import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/Navbar';

interface BookedMentor {
  id: string;
  name: string;
  subjects: string[];
  experience: string;
  rating: number;
  nextSession: string;
  profilePicture?: string;
}

export function StudentDashboard() {
  const [bookedMentors, setBookedMentors] = useState<BookedMentor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch booked mentors from API
    const fetchBookedMentors = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        const mockMentors: BookedMentor[] = [
          {
            id: '1',
            name: 'Dr. Sarah Johnson',
            subjects: ['Physics', 'Mathematics'],
            experience: '5+ years',
            rating: 4.8,
            nextSession: '2024-01-15T10:00:00Z',
            profilePicture: '/api/placeholder/150/150'
          },
          {
            id: '2',
            name: 'Prof. Michael Chen',
            subjects: ['Chemistry', 'Biology'],
            experience: '3-5 years',
            rating: 4.9,
            nextSession: '2024-01-16T14:00:00Z',
            profilePicture: '/api/placeholder/150/150'
          },
          {
            id: '3',
            name: 'Ms. Emily Rodriguez',
            subjects: ['English Literature'],
            experience: '1-3 years',
            rating: 4.7,
            nextSession: '2024-01-17T16:00:00Z',
            profilePicture: '/api/placeholder/150/150'
          }
        ];
        
        setBookedMentors(mockMentors);
      } catch (error) {
        console.error('Error fetching booked mentors:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookedMentors();
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

  const handleReschedule = (mentorId: string) => {
    // TODO: Implement reschedule functionality
    console.log('Reschedule session for mentor:', mentorId);
  };

  const handleCancel = (mentorId: string) => {
    // TODO: Implement cancel functionality
    console.log('Cancel session for mentor:', mentorId);
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Dashboard</h1>
          <p className="text-gray-600">Manage your booked mentoring sessions</p>
        </div>

        {bookedMentors.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No booked sessions</h3>
              <p className="text-gray-500 mb-4">You haven't booked any mentoring sessions yet.</p>
              <Button className="bg-black text-white hover:bg-gray-800">
                Find a Mentor
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {bookedMentors.map((mentor) => (
              <Card key={mentor.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      {mentor.profilePicture ? (
                        <img
                          src={mentor.profilePicture}
                          alt={mentor.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-gray-500 font-semibold">
                          {mentor.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{mentor.name}</CardTitle>
                      <div className="flex items-center space-x-1">
                        <span className="text-yellow-400">★</span>
                        <span className="text-sm text-gray-600">{mentor.rating}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Subjects</h4>
                    <div className="flex flex-wrap gap-1">
                      {mentor.subjects.map((subject, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                        >
                          {subject}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Experience</h4>
                    <p className="text-sm text-gray-600">{mentor.experience}</p>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Next Session</h4>
                    <p className="text-sm text-gray-600">{formatDate(mentor.nextSession)}</p>
                  </div>

                  <div className="flex space-x-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleReschedule(mentor.id)}
                      className="flex-1"
                    >
                      Reschedule
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCancel(mentor.id)}
                      className="flex-1 text-red-600 hover:text-red-700"
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 