'use client'
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { format } from "date-fns";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useToast } from "../ui/use-toast";
import { SetStateAction, useEffect, useState } from "react";
import { DatePickerWithPresets } from "./Datepicker";
import { getGuestByName } from "@/actions/getGuestId";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { cn } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { Textarea } from "../ui/textarea";




const formSchema = z.object({
    Booking_id:    z.string(),               
    Booking_date:   z.string(),      
    Guest_id:    z.string(),     
    Check_in:   z.date({
      required_error: "A check in date is required.",
    }),                   
    check_out    : z.date({
      required_error: "A check out date is required.",
    }),             
    Room_type    :z.enum(["Family","Deluxe","Suite"]),    
    Booking_status  :z.enum(["Pending","Confirmed"]), 
    Rooms_booked    : z.string().min(1,{
        message: 'Rooms booked must be greater than 0',
    }), 
    Adults: z.string(),
    Children    : z.string(),     
    Extra_person     :z.string(),
    Total_amount      : z.string().min(3,{
        message: 'Total amount must be greater than 3 digits',
    }),
    Advance_received: z.string(),           
    Date_of_advance : z.date({
      required_error: "A date of advance is required.",
    }),         
    Balance_due     :  z.string(),           
    Due_date        : z.date({
      required_error: "A due date is required.",
    }),          
    Payment_status  :  z.enum(["Paid","Partially Paid","To be paid"]),    
    Sources     :z.enum(["Travel Agent","Ads","Organic","Booking Engine"]),        
    Special_request : z.string(),   
    guest_name:z.string(),           
  });

  

  const  AddBookingDetails = ({latestBookingId:lbi,latestGuestId:lgi}:{latestBookingId?:string,latestGuestId?:string}) => {
   const [setStartDate,startDate] = useState<any>()
   const [availableRooms, setAvailableRooms] = useState<{ Room_id: string | null }[]>([]);
    const [latestBookingId, setLatestBookingId] = useState(""); 
    const [latestGuestId, setLatestGuestId] = useState("");// State to store the latest guest ID
   
  const Router = useRouter();
    const [formBody,setFormBody] = useState( {
        Booking_id:   lbi,                
        Booking_date:    format(new Date(),"dd/MM/yyyy"),     
        Guest_id:    lgi,     
        Check_in:    format(new Date(), "yyyy-MM-dd") ,                 
        check_out    :   format(new Date(), "yyyy-MM-dd"),           
        Adults: "0",
        Children    : "0",     
        Extra_person  :"0",          
        Date_of_advance :   format(new Date(), "yyyy-MM-dd"),       
        Balance_due     :  "0",           
        Due_date        :   format(new Date(), "yyyy-MM-dd"),        
        Special_request :  "",
      
    })
  
    useEffect(()=>{
      
        setFormBody(prev=>({...prev,Booking_id:latestBookingId}))
        
  
    },[latestBookingId])
    

    useEffect(()=>{
        setFormBody(prev=>({...prev,Guest_id:latestGuestId}))
    },[latestGuestId])

    // Run this effect only once when the component mounts

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues:  {
            ...formBody,
            Check_in: new Date(formBody.Check_in), // Convert Check_in to a Date object
            Balance_due: formBody.Balance_due.toString(), // Convert Balance_due to a string
            check_out: new Date(formBody.check_out), // Convert check_out to a Date object
            Date_of_advance: new Date(formBody.Date_of_advance), // Convert Date_of_advance to a Date object
            Due_date: new Date(formBody.Due_date) // Convert Due_date to a Date object
        },
    }); 
    const [isLoading, setIsLoading] = useState(false);
    const {toast} = useToast();
  async function onSubmitForm(values: z.infer<typeof formSchema>) {
    
    setIsLoading(true);
   return await axios.post('/api/bookings', values).then((res) =>{
    
    toast({
      variant: 'success',
      description: "🎉 Guest created"
    })
    Router.push(`/bookings`) 
    
  }).catch((error) => {
    console.error("Error creating guest:", error);
    toast({
      variant: 'destructive',
      description: "Failed to create guest"
    });
  })
  .finally(() => {
    setIsLoading(false);
  });
}



// const [guestName, setGuestName] = useState(""); // State to store the guest name
// const [guestId, setGuestId] = useState(""); // State to store the guest ID

// Function to handle guest name input change
// const handleGuestNameChange = (e: { target: { value: SetStateAction<string>; }; }) => {
//     setGuestName(e.target.value);
// };

// Function to fetch guest ID based on the guest name



  return (
    <main>
       <div>
        
       </div>
      <Form {...form} >
      <h3  className="text-lg font-semibold">Make a New Booking</h3>
        <form  onSubmit={form.handleSubmit(onSubmitForm)} className="space-y-6 py-4">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className=" space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div><FormField
          control={form.control}
          shouldUnregister={false} 
          name="Booking_id"
          render={({ field }) => (
              <FormItem>
                    <FormLabel>Booking ID *</FormLabel>
                   
                        <FormControl>
                         <Input
                         disabled placeholder={lbi} {...field} />
                        </FormControl>
                        
                <FormMessage />
              </FormItem>
            )}/></div>
          <div>
          <FormField
          control={form.control}
          name="Booking_date"
          render={({ field }) => (
              <FormItem>
                    <FormLabel>Booking Date *</FormLabel>
                    
                        <FormControl>
                           <Input
                          disabled
                        
                          {...field} />
                        </FormControl>
                        
                <FormMessage />
              </FormItem>
            )}/>
          </div>
        </div>
          

        
             
             <FormField
          control={form.control}
          shouldUnregister={false} 
          name="Guest_id"
          render={({ field }) => (
              <FormItem>
                    <FormLabel>Guest ID *</FormLabel>
                   
                        <FormControl>
                         <Input
                         placeholder="Enter guest id here"  {...field} />
                        </FormControl>
                        
                <FormMessage />
              </FormItem>
            )}/>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
              <FormField
          control={form.control}
          name="Check_in"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Check In *</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    > 
                      {field.value ? (
                        format(field.value, "dd/MM/yyyy")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

              </div>
            <div>
            <FormField
          control={form.control}
          name="check_out"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Check Out *</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value,  "dd/MM/yyyy")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
            </div>
            </div>
           


           
             <FormField
          control={form.control}
          name="Room_type"
          render={({ field }) => (
              <FormItem>
                    <FormLabel>Room Type *</FormLabel>
                   
                        <FormControl>
                        <Select onValueChange={field.onChange}>
                      <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Room Type " />
                          </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                      <SelectItem value="Deluxe">Deluxe</SelectItem>
                        <SelectItem value="Family">Family</SelectItem>
                        <SelectItem value="Suite">Suite</SelectItem>
                      </SelectContent>
                      </Select>
                        </FormControl>
                        
                <FormMessage />
              </FormItem>
            )}/>
 <FormField
          control={form.control}
          name="Booking_status"
          render={({ field }) => (
              <FormItem>
                    <FormLabel>Booking Status *</FormLabel>
                   
                        <FormControl>
                        <Select onValueChange={field.onChange}>
                      <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Booking Status " />
                          </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                      <SelectItem value="Confirmed">Confirmed</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        
                      </SelectContent>
                      </Select>
                        </FormControl>
                        
                <FormMessage />
              </FormItem>
            )}/>

        <FormField
          control={form.control}
          name="Rooms_booked"
          render={({ field }) => (
              <FormItem>
                    <FormLabel>Rooms Booked *</FormLabel>
                    
                        <FormControl>
                           <Input  placeholder="Enter number of rooms to be booked here " {...field} />
                        </FormControl>
                        
                <FormMessage />
              </FormItem>
            )}/>
        
       
        </div>
        <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
             <FormField
          control={form.control}
          name="Adults"
          render={({ field }) => (
              <FormItem>
                    <FormLabel>Adults *</FormLabel>
                    <FormControl>
                           <Input  placeholder="Enter number of adults here " {...field} />
                        </FormControl>
                        
                <FormMessage />
              </FormItem>
            )}/>
            </div>
          <div>
          <FormField
          control={form.control}
          name="Children"
          render={({ field }) => (
              <FormItem>
                    <FormLabel>Children *</FormLabel>
                    <FormControl>
                           <Input placeholder="Enter number of Childrens here " {...field} />
                        </FormControl>
                        
                <FormMessage />
              </FormItem>
            )}/>
          </div>
          <div>
          <FormField
          control={form.control}
          name="Extra_person"
          render={({ field }) => (
              <FormItem>
                    <FormLabel>Extra Person *</FormLabel>
                   
                        <FormControl>
                           <Input placeholder="Enter number of extra person here " {...field} />
                        </FormControl>
                        
                <FormMessage />
              </FormItem>
            )}/>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
          <FormField
          control={form.control}
          name="Total_amount"
          render={({ field }) => (
              <FormItem>
                    <FormLabel>Total Amount *</FormLabel>
  
                        <FormControl>
                           <Input placeholder="Enter total amount here " {...field} />
                        </FormControl>
                        
                <FormMessage />
              </FormItem>
            )}/>
          </div>
          <div>
             <FormField
          control={form.control}
          name="Advance_received"
          render={({ field }) => (
              <FormItem>
                    <FormLabel>Advance Received *</FormLabel>
                    
                        <FormControl>
                           <Input placeholder="Enter advance amount here " {...field} />
                        </FormControl>
                        
                <FormMessage />
              </FormItem>
            )}/>    
          </div>
          <div>
          <FormField
          control={form.control}
          name="Balance_due"
          render={({ field }) => (
              <FormItem>
                    <FormLabel> Balance Due *</FormLabel>
                    
                        <FormControl>
                           <Input placeholder="Enter due balance here " {...field} />
                        </FormControl>       
                <FormMessage />
              </FormItem>
            )}/>

          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
          <FormField
          control={form.control}
          name="Date_of_advance"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date of advance *</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value,  "dd/MM/yyyy")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
          </div>
          <div><FormField
          control={form.control}
          name="Due_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Due Date *</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value,  "dd/MM/yyyy")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        </div>
        </div>
      

          

 <FormField
          control={form.control}
          name="Payment_status"
          render={({ field }) => (
              <FormItem>
                    <FormLabel> Payment status *</FormLabel>
                   
                    <Select onValueChange={field.onChange}>
                      <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select payment status" />
                          </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                      <SelectItem value="Paid">Paid</SelectItem>
                        <SelectItem value="Partially Paid">Partially Paid</SelectItem>
                        <SelectItem value="To be paid">To be paid</SelectItem>
                      </SelectContent>
                      </Select>  
                <FormMessage />
              </FormItem>
            )}/>
       <FormField
          control={form.control}
          name="Sources"
          render={({ field }) => (
              <FormItem>
                    <FormLabel> Source </FormLabel>
                   
                    <Select onValueChange={field.onChange}>
                      <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select source" />
                          </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                      <SelectItem value="Ads">Ads</SelectItem>
                      <SelectItem value="Booking Engine">Booking Engine</SelectItem>
                      <SelectItem value="Organic">Organic</SelectItem>
                      <SelectItem value="Travel Agent">Travel Agent</SelectItem>
                      </SelectContent>
                      </Select>  
                <FormMessage />
              </FormItem>
            )}/>
            <FormField
          control={form.control}
          name="Special_request"
          render={({ field }) => (
              <FormItem>
                    <FormLabel> Special Request </FormLabel>
                    
                        <FormControl>
                          <Input placeholder="Enter special requests here " {...field}/>
                        </FormControl>       
                <FormMessage />
              </FormItem>
            )}/>
         
          </div >
        
        </div>
        <div className="px-24 pt-7 text-center">
        <Button
            type="submit"
          className="md:w-[500px] mx-auto text-sm" onClick={async ()=>{
            onSubmitForm(form.getValues());
            // form.handleSubmit(onSubmitForm)
          }}>
            {isLoading ? "Submitting..." : "Submit"}
          </Button>
        </div>
        </form>
      </Form>
    </main>
  );

};
 
export default AddBookingDetails;



