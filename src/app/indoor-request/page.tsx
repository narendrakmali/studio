
"use client";

import { useState, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { redirect } from "next/navigation";

export default function IndoorRequestPage() {
  redirect("/outdoor-request");
}
                                        placeholder="Enter any special instructions or requirements..."
                                        className="min-h-[80px]"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
                        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        ✅ Submit Request
                        </Button>
                    </CardFooter>
                </form>
            </Form>
            </Card>
        </div>
        <AlertDialog open={showSuccessAlert} onOpenChange={setShowSuccessAlert}>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>Request Submitted Successfully!</AlertDialogTitle>
                <AlertDialogDescription>
                    Please get in touch with our team members with the approval copy from your Department Head:
                    <br/><br/>
                    <strong>Sh. Prasad More ji:</strong> 9960703710
                    <br/>
                    <strong>Sh. Akash More ji:</strong> 9503707518
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogAction onClick={() => setShowSuccessAlert(false)}>OK</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
        </div>
    </>
  );
}
