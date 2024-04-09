"use client";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import { Card, CardContent, CardHeader } from "../ui/card";
import { Button } from "../ui/button";

export function ManageSchedule() {
  return (
    <Card>
      <CardHeader>
        <h2 className="font-bold text-lg text-slate-800">Manage Schedule</h2>
        <h4 className="font-light text-slate-500">
          Setup a Workout for Each Day of the Week
        </h4>
      </CardHeader>

      <CardContent>
        <Drawer>
          <DrawerTrigger>Open</DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Are you absolutely sure?</DrawerTitle>
              <DrawerDescription>
                This action cannot be undone.
              </DrawerDescription>
            </DrawerHeader>
            <DrawerFooter>
              <Button>Submit</Button>
              <DrawerClose>Cancel</DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </CardContent>
    </Card>
  );
}
