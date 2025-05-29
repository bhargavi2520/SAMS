import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Copy, Upload } from 'lucide-react';

const QuickActions = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 md:gap-3">
          <Button variant="default" onClick={() => console.log('Add New Schedule clicked')}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Schedule
          </Button>
          <Button variant="secondary" onClick={() => console.log('Clone Timetable clicked')}>
            <Copy className="mr-2 h-4 w-4" /> Clone Timetable
          </Button>
          <Button variant="ghost" onClick={() => console.log('Export Schedule clicked')}>
            <Upload className="mr-2 h-4 w-4" /> Export Schedule
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;