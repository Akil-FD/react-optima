import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { createRegisterSchema, type RegisterFormValues } from "../../../validators/auth-schema";
import Input from "../../../components/ui/Input/Input";
import Checkbox from "../../../components/ui/Checkbox/Checkbox";
import MobileNumber, { type CountryOption } from "../../../components/ui/MobileNumber/MobileNumber";
import Button from "../../../components/ui/Button/Button";
import OTPInput from "../../../components/ui/OTPInput/OTPInput";
import { DEFAULT_VALUES, PATH } from "../../../utils/constant";
import { useEffect, useMemo, useState } from "react";
import type { OTPState } from "../../../types/auth";
import { useApi } from "../../../hooks/useApi";
import { authService } from "../../../api/service/auth.service";
import Dialog from "../../../components/ui/Dialog/Dialog";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { registerUser } from "../../../store/auth/auth.thunk";
import { ENV } from "../../../config/env";
import { Controller, useForm, useWatch } from "react-hook-form";
import HomeLayout from "../../../components/layout/HomeLayout";


const countries: CountryOption[] = [
    { code: "+91", label: "India", flag: "🇮🇳" },
    { code: "+1", label: "USA", flag: "🇺🇸" },
    { code: "+44", label: "UK", flag: "🇬🇧" },
];

function Registration() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
 
    const [OTPVerify, setOTPVerify] = useState<OTPState>({
        email: { isSubmitted: false, isVerified: false },
        contactNo: { isSubmitted: false, isVerified: false },
    });

    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);

    const sendMailOtp = useApi(authService.requestOTPMail);
    const verifyMailOtp = useApi(authService.verifyOTPMail);

    const sendSmsOtp = useApi(authService.requestSmsMail);
    const verifySmsOtp = useApi(authService.verifySmsMail);

    const register = useApi(authService.registerUser);

    const [isEmailOtpRequired, setIsEmailOtpRequired] = useState(false);
    const [isPhoneOtpRequired, setIsPhoneOtpRequired] = useState(false);

    const formLabels = {
        firstName: { key: 'firstName', type: 'text', label: 'First Name', placeholder: 'Enter name', },
        lastName: { key: 'lastName', type: 'text', label: 'Last Name', placeholder: 'Enter last name', },
        designation: { key: 'designation', type: 'text', label: 'Designation', placeholder: 'Enter designation', },
        email: { key: 'email', type: 'email', label: 'Email ID', placeholder: 'Enter work mail ID', },
        emailOTP: { key: 'emailOTP', type: 'text', label: '', placeholder: '' },
        contactNo: { key: 'contactNumber', type: 'tel', label: 'Mobile Number', placeholder: 'Enter mobile number', },
        contactNumberOTP: { key: 'contactNumberOTP', type: 'text', label: '', placeholder: '' },
        password: { key: 'password', type: 'password', label: 'Password', placeholder: 'Enter Password', },
        confirmPassword: { key: 'confirmPassword', type: 'password', label: 'Confirm Password', placeholder: 'Confirm Password', },
        organisation: { key: 'organisation', type: 'text', label: 'Organisation', placeholder: 'Enter organisation', },
        termsAndCondition: { key: 'termsAndCondition', type: 'checkbox', label: '', placeholder: '' }
    };

    const formDefaultValues: RegisterFormValues = {
        firstName: '',
        lastName: '',
        designation: '',
        email: '',
        emailOTP: '',
        password: '',
        confirmPassword: '',
        countryCode: countries[0].code,
        contactNumber: '',
        contactNumberOTP: '',
        organisation: '',
        termsAndCondition: false

    };

    const schema = useMemo(
        () => createRegisterSchema(isEmailOtpRequired, isPhoneOtpRequired),
        [isEmailOtpRequired, isPhoneOtpRequired]
    );

    const form = useForm<RegisterFormValues>({
        resolver: zodResolver(schema),
        defaultValues: formDefaultValues,
        mode: "onChange",
    });


    const emailState = form.getFieldState("email");
    const isEmailTouched = emailState.isDirty;
    const isEmailValid = !emailState.invalid;

    const contactNoState = form.getFieldState("contactNumber");
    const isContactNoTouched = contactNoState.isDirty;
    const isContactNoValid = !contactNoState.invalid;

    const selectedCountry = useWatch({
        control: form.control,
        name: "countryCode",
    });


    useEffect(() => {
        if (OTPVerify.contactNo.isVerified || OTPVerify.email.isVerified) {
            clearOTPFieldErrors();
        }
    }, [OTPVerify]);

    const clearOTPFieldErrors = () => {
        form.resetField(formLabels.emailOTP.key as keyof RegisterFormValues);
        form.clearErrors(formLabels.emailOTP.key as keyof RegisterFormValues);
        form.resetField(formLabels.contactNumberOTP.key as keyof RegisterFormValues);
        form.clearErrors(formLabels.contactNumberOTP.key as keyof RegisterFormValues);
    };

    const onSubmit = (data: RegisterFormValues) => {
        handleRegister(data);
    };

    const onEmailOTPSubmit = async (fieldName: "email" | "contactNo") => {

        if (fieldName === "email") {
            await verifyMailOTP();
        } else {
            await verifySmsOTP();
        }
    };

    const handleRegister = async (values: RegisterFormValues) => {
        try {
            await dispatch(registerUser({
                name: `${values.firstName} ${values.lastName}`,
                password: values.password,
                confirm_password: values.confirmPassword,
                email: values.email,
                designation: values.designation,
                mobile: values.contactNumber,
                organization_name: values.organisation,
            }))
                .unwrap()
                .then((res) => setIsSuccessDialogOpen(true))
                .catch((err) => alert(err));
        } catch (error) {
            console.error(error);
        }
    }


    const requestMailOTP = async () => {
        try {

            if (isEmailValid && isEmailTouched) {
                const res = await sendMailOtp.request({
                    mail: form.getValues(formLabels.email.key as keyof RegisterFormValues) as string,
                });
                console.log(res);

                if (res) {
                    setOTPVerify((prev) => ({
                        ...prev,
                        email: { isSubmitted: true, isVerified: false },
                    })
                    );
                }
            }
            setIsEmailOtpRequired(true);
            form.trigger(formLabels.emailOTP.key as keyof RegisterFormValues);
        } catch (error) {
            console.error(error);
        }

    }


    const verifyMailOTP = async () => {
        try {
            const emailOTP = form.getValues('emailOTP');
            if (emailOTP?.length === DEFAULT_VALUES.OTP_FIELD_SIZE) {
                const res = await verifyMailOtp.request({
                    mail: form.getValues(formLabels.email.key as keyof RegisterFormValues) as string,
                    otp: ENV.DEFAULT_OTP || ''

                });

                if (res) {
                    setOTPVerify((prev) => ({
                        ...prev,
                        email: { isSubmitted: false, isVerified: true },
                    })
                    );
                    setIsEmailOtpRequired(false);
                    form.trigger(formLabels.emailOTP.key as keyof RegisterFormValues);
                }
            } else {
                setIsEmailOtpRequired(true);
                form.trigger(formLabels.emailOTP.key as keyof RegisterFormValues);
            }

        } catch (error) {
            console.error(error);
        }
    }

    const requestSmsOTP = async () => {
        try {

            if (isContactNoValid && isContactNoTouched) {
                const res = await sendSmsOtp.request({
                    mobile: form.getValues(formLabels.contactNo.key as keyof RegisterFormValues) as string,
                });

                if (res) {
                    setOTPVerify((prev) => ({
                        ...prev,
                        contactNo: { isSubmitted: true, isVerified: false },
                    })
                    );
                }
            }
            setIsPhoneOtpRequired(true);
            form.trigger(formLabels.contactNumberOTP.key as keyof RegisterFormValues);
        } catch (error) {
            console.error(error);

        }


    }


    const verifySmsOTP = async () => {
        try {
            const contactNoOTP = form.getValues(formLabels.contactNumberOTP.key as keyof RegisterFormValues) as string;
            if (contactNoOTP?.length === DEFAULT_VALUES.OTP_FIELD_SIZE) {
                const res = await verifySmsOtp.request({
                    mobile: form.getValues(formLabels.contactNo.key as keyof RegisterFormValues) as string,
                    otp: ENV.DEFAULT_OTP || ''
                });

                if (res) {
                    setOTPVerify((prev) => ({
                        ...prev,
                        contactNo: { isSubmitted: false, isVerified: true },
                    })
                    );
                    setIsPhoneOtpRequired(false);
                    form.trigger(formLabels.contactNumberOTP.key as keyof RegisterFormValues);
                }

            } else {
                setIsPhoneOtpRequired(true);
                form.trigger(formLabels.contactNumberOTP.key as keyof RegisterFormValues);
            }
        } catch (error) {
            console.error(error);

        }
    }

    const handleAccept = () => {
        setIsDialogOpen(false);
    }


    return (
        <HomeLayout>
            <div className="home-layout">
                <h1>CANDIDATE REGISTRATION</h1>
                <div className="register-container">
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="form-container">
                            <div className="parent-input-container">
                                <Input
                                    label={formLabels.firstName.label}
                                    placeholder={formLabels.firstName.placeholder}
                                    className="input-rounded-lg"
                                    {...form.register(formLabels.firstName.key as keyof RegisterFormValues)}
                                    error={form.formState.errors.firstName?.message}
                                />

                                <Input
                                    label={formLabels.lastName.label}
                                    placeholder={formLabels.lastName.placeholder}
                                    className="input-rounded-lg"
                                    {...form.register(formLabels.lastName.key as keyof RegisterFormValues)}
                                    error={form.formState.errors.lastName?.message}
                                />

                                <Input
                                    label={formLabels.designation.label}
                                    placeholder={formLabels.designation.placeholder}
                                    className="input-rounded-lg"
                                    {...form.register(formLabels.designation.key as keyof RegisterFormValues)}
                                    error={form.formState.errors.designation?.message}
                                />
                            </div>

                            <div className="parent-input-container">
                                <Input
                                    label={formLabels.email.label}
                                    placeholder={formLabels.email.placeholder}
                                    className="input-rounded-lg"
                                    disabled={isEmailValid && isEmailTouched && OTPVerify.email.isSubmitted}
                                    {...form.register(formLabels.email.key as keyof RegisterFormValues)}
                                    error={form.formState.errors.email?.message}
                                />

                                {
                                    OTPVerify.email.isSubmitted && isEmailTouched && isEmailValid &&
                                    <>

                                        <Controller
                                            name={formLabels.emailOTP.key as keyof RegisterFormValues}
                                            control={form.control}
                                            render={({ field, fieldState }) => (
                                                <OTPInput
                                                    length={DEFAULT_VALUES.OTP_FIELD_SIZE}
                                                    onChange={field.onChange}
                                                    value={typeof field.value === 'string' ? field.value : ''}
                                                    error={fieldState.error?.message}
                                                />
                                            )}
                                        />

                                        <Button
                                            variant="outline"
                                            type="button"
                                            onClick={() => onEmailOTPSubmit('email')}
                                            disabled={verifyMailOtp.loading}
                                            className="btn-flex"
                                        >
                                            {verifyMailOtp.loading && <span className="spinner" />}
                                            {verifyMailOtp.loading ? "Submitted..." : "Submit"}
                                        </Button>
                                    </>
                                    ||
                                    <Button
                                        variant="outline"
                                        type="button"
                                        onClick={requestMailOTP}
                                        disabled={sendMailOtp.loading}
                                        className="btn-flex"
                                    >
                                        {sendMailOtp.loading && <span className="spinner" />}
                                        {sendMailOtp.loading ? "Sending..." : "Send OTP"}
                                    </Button>

                                }
                            </div>


                            <div className="parent-input-container">
                                <MobileNumber
                                    label={formLabels.contactNo.label}
                                    placeholder={formLabels.contactNo.placeholder}
                                    countries={countries}
                                    selectedCountry={selectedCountry}
                                    disabled={isContactNoValid && isContactNoTouched && OTPVerify.contactNo.isSubmitted}
                                    onCountryChange={(code) => form.setValue("countryCode", code)}
                                    {...form.register(formLabels.contactNo.key as keyof RegisterFormValues)}
                                    error={form.formState.errors.contactNumber?.message}
                                />
                                {
                                    OTPVerify.contactNo.isSubmitted && isContactNoTouched && isContactNoValid &&
                                    <>
                                        <Controller
                                            name={formLabels.contactNumberOTP.key as keyof RegisterFormValues}
                                            control={form.control}
                                            render={({ field, fieldState }) => (
                                                <OTPInput
                                                    length={DEFAULT_VALUES.OTP_FIELD_SIZE}
                                                    onChange={field.onChange}
                                                    value={typeof field.value === 'string' ? field.value : ''}
                                                    error={fieldState.error?.message}
                                                />
                                            )}
                                        />
                                        <Button
                                            variant="outline"
                                            type="button"
                                            onClick={() => onEmailOTPSubmit('contactNo')}
                                            disabled={verifySmsOtp.loading}
                                            className="btn-flex"
                                        >
                                            {verifySmsOtp.loading && <span className="spinner" />}
                                            {verifySmsOtp.loading ? "Submitted..." : "Submit"}
                                        </Button>
                                    </>
                                    ||
                                    <Button
                                        variant="outline"
                                        type="button"
                                        onClick={requestSmsOTP}
                                        disabled={sendSmsOtp.loading}
                                        className="btn-flex"
                                    >
                                        {sendSmsOtp.loading && <span className="spinner" />}
                                        {sendSmsOtp.loading ? "Sending..." : "Send OTP"}
                                    </Button>
                                }

                            </div>

                            <div className="parent-input-container">
                                <Input
                                    label={formLabels.password.label}
                                    placeholder={formLabels.password.placeholder}
                                    className="input-rounded-lg"
                                    {...form.register(formLabels.password.key as keyof RegisterFormValues)}
                                    error={form.formState.errors.password?.message}
                                />
                                <Input
                                    label={formLabels.confirmPassword.label}
                                    placeholder={formLabels.confirmPassword.placeholder}
                                    className="input-rounded-lg"
                                    {...form.register(formLabels.confirmPassword.key as keyof RegisterFormValues)}
                                    error={form.formState.errors.confirmPassword?.message}
                                />
                                <Input
                                    label={formLabels.organisation.label}
                                    placeholder={formLabels.organisation.placeholder}
                                    className="input-rounded-lg"
                                    {...form.register(formLabels.organisation.key as keyof RegisterFormValues)}
                                    error={form.formState.errors.organisation?.message}
                                />
                            </div>

                            <div className="parent-input-container">
                                <Checkbox
                                    value={form.watch("termsAndCondition") as boolean}
                                    onChange={(val) => {
                                        form.setValue("termsAndCondition", val);
                                        form.trigger('termsAndCondition');
                                        if (val) {
                                            setIsDialogOpen(true);
                                        }

                                    }
                                    }
                                    error={form.formState.errors.termsAndCondition?.message}
                                    label={
                                        <>
                                            I accept the <a href="#">privacy & terms</a> and{" "}
                                            <a href="#">conditions</a>
                                        </>

                                    }
                                />

                            </div>

                            <Dialog isOpen={isDialogOpen}>
                                <>
                                    <h2>Privacy & Terms</h2>
                                    <p>
                                        It is a long established fact that a reader will be distracted by
                                        the readable content of a page when looking at its layout.
                                    </p>
                                    <Button variant="outline" className="gradient-btn" onClick={handleAccept}>Accept</Button>
                                </>
                            </Dialog>

                            <Dialog isOpen={isSuccessDialogOpen}>
                                <button type="button" className="dialog-close" onClick={() => { setIsSuccessDialogOpen(false) }}>
                                    ×
                                </button>

                                <div className="dialog-icon">✅</div>

                                <h2 className="dialog-title">Successfully Submitted</h2>
                                <p className="dialog-message">Thank you! Your form has successfully submitted</p>

                                <Button className="dialog-continue" onClick={() => {
                                    setIsSuccessDialogOpen(false);
                                    navigate(PATH.DASHBOARD)
                                }}>
                                    Continue
                                </Button>
                            </Dialog>

                            <div className="btn-container">
                                <Button type="submit" variant="outline" disabled={register.loading} className="gradient-btn btn-lg">
                                    {register.loading && <span className="spinner" />}
                                    {register.loading ? "Submitting..." : "Submit"}
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </HomeLayout>
    );
}

export default Registration;
