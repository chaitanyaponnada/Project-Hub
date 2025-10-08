
"use client";

import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2, Package, Download, MessageSquare } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { getInquiriesByUserId, getSalesByUserId } from "@/lib/firebase-services";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { format } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Project, Sale } from "@/lib/placeholder-data";

export default function ProfilePage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [isClient, setIsClient] = useState(false);
    const [inquiries, setInquiries] = useState<any[]>([]);
    const [purchases, setPurchases] = useState<Sale[]>([]);
    const [loadingData, setLoadingData] = useState(true);

    useEffect(() => {
        setIsClient(true);
        if (!loading && !user) {
            router.push('/login?redirect=/profile');
        }
    }, [user, loading, router]);
    
    useEffect(() => {
        if (user) {
            const fetchData = async () => {
                setLoadingData(true);
                try {
                    const [userInquiries, userPurchases] = await Promise.all([
                        getInquiriesByUserId(user.uid),
                        getSalesByUserId(user.uid)
                    ]);
                    setInquiries(userInquiries);
                    setPurchases(userPurchases as Sale[]);
                } catch (error) {
                    console.error("Error fetching profile data:", error);
                    setInquiries([]);
                    setPurchases([]);
                } finally {
                    setLoadingData(false);
                }
            };
            fetchData();
        }
    }, [user]);

    if (!isClient || loading || !user) {
        return (
            <div className="flex items-center justify-center h-[50vh]">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }
    
    const getInitials = (name?: string | null) => {
        if (!name) return "U";
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    }

    return (
        <div className="container mx-auto px-4 py-16 md:py-24 animate-fade-in">
            <div className="max-w-4xl mx-auto">
                <header className="flex items-center gap-6 mb-12 animate-fade-in-down">
                    <Avatar className="h-24 w-24">
                        <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
                        <AvatarFallback className="text-3xl">{getInitials(user.displayName)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h1 className="font-headline text-3xl font-bold text-primary">{user.displayName}</h1>
                        <p className="text-muted-foreground">{user.email}</p>
                    </div>
                </header>

                <Tabs defaultValue="projects" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-8">
                        <TabsTrigger value="projects">
                            <Package className="mr-2 h-4 w-4" />
                            Purchased Projects
                        </TabsTrigger>
                        <TabsTrigger value="inquiries">
                             <MessageSquare className="mr-2 h-4 w-4" />
                            My Inquiries
                        </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="projects">
                         <Card>
                            <CardHeader>
                                <CardTitle>My Purchased Projects</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {loadingData ? (
                                     <div className="flex items-center justify-center h-32">
                                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                                    </div>
                                ) : purchases.length > 0 ? (
                                    <div className="space-y-4">
                                        {purchases.map(item => (
                                            <Card key={item.id} className="flex flex-col sm:flex-row items-center p-4">
                                                <div className="relative h-32 w-full sm:h-24 sm:w-24 rounded-md overflow-hidden mr-0 sm:mr-4 mb-4 sm:mb-0 flex-shrink-0">
                                                    <Image src={item.projectImageUrl || "https://placehold.co/600x400"} alt={item.projectTitle} fill className="object-cover" />
                                                </div>
                                                <div className="flex-1 text-center sm:text-left">
                                                    <h3 className="font-semibold text-lg">{item.projectTitle}</h3>
                                                     <p className="text-muted-foreground text-sm">
                                                        Purchased on {item.purchasedAt?.toDate ? format(item.purchasedAt.toDate(), 'PPP') : 'N/A'}
                                                    </p>
                                                </div>
                                                <Button asChild className="mt-4 sm:mt-0 sm:ml-4 flex-shrink-0">
                                                    <a href={item.projectDownloadUrl} target="_blank" rel="noopener noreferrer">
                                                        <Download className="mr-2 h-4 w-4" />
                                                        Download Files
                                                    </a>
                                                </Button>
                                            </Card>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center p-12 border-dashed rounded-lg">
                                        <Package className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                                        <h2 className="font-headline text-2xl font-semibold mb-2">No Projects Purchased</h2>
                                        <p className="text-muted-foreground mb-6">Your purchased projects will appear here. Currently not available.</p>
                                        <Button onClick={() => router.push('/projects')}>Browse Projects</Button>
                                    </div>
                                )}
                            </CardContent>
                         </Card>
                    </TabsContent>

                    <TabsContent value="inquiries">
                        <Card>
                             <CardHeader>
                                <CardTitle>My Inquiries</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {loadingData ? (
                                    <div className="flex items-center justify-center h-32">
                                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                                    </div>
                                ) : inquiries.length > 0 ? (
                                    <Accordion type="single" collapsible className="w-full space-y-4">
                                        {inquiries.map(inquiry => (
                                            <Card key={inquiry.id} className="overflow-hidden">
                                                <AccordionItem value={inquiry.id} className="border-b-0">
                                                    <AccordionTrigger className="p-6 hover:no-underline">
                                                        <div className="flex-1 text-left">
                                                            <p className="font-semibold">{inquiry.message.substring(0, 80)}{inquiry.message.length > 80 && '...'}</p>
                                                            <p className="text-sm text-muted-foreground mt-1">
                                                                Asked on {inquiry.receivedAt?.toDate ? format(inquiry.receivedAt.toDate(), 'PPP') : 'N/A'}
                                                            </p>
                                                        </div>
                                                    </AccordionTrigger>
                                                    <AccordionContent className="px-6 pb-6">
                                                        <p className="text-muted-foreground whitespace-pre-wrap">{inquiry.message}</p>
                                                    </AccordionContent>
                                                </AccordionItem>
                                            </Card>
                                        ))}
                                    </Accordion>
                                ) : (
                                    <div className="text-center p-12 border-dashed rounded-lg">
                                        <MessageSquare className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                                        <h2 className="font-headline text-2xl font-semibold mb-2">No Inquiries Sent</h2>
                                        <p className="text-muted-foreground mb-6">Your questions to us will appear here. Currently not available.</p>
                                        <Button onClick={() => router.push('/contact')}>Ask a Question</Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
